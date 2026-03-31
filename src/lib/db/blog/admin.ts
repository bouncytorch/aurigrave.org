'use server';

import Blog, { BlogState } from '@/models/Blog';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { InferAttributes, InferCreationAttributes, QueryTypes } from 'sequelize';
import { getRelativeURL, uploadFile } from '../../server/copyparty';
import sharp from 'sharp';
import { CanvasRenderingContext2D, createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import sequelize from '@/lib/db';

function invalidate(id?: string, tags?: string[]) {
    const profile = { expire: 0 };
    revalidateTag('blogs',     profile);
    revalidateTag('blog-tags', profile);
    if (id)   revalidateTag(`blog:${id}`,       profile);
    if (tags) tags.forEach(t => revalidateTag(`blog-tag:${t}`, profile));
}

// TODO: MAKE THIS CROP IMAGE TO 16:9 OR 4:3 AT THE VERY LEAST
async function uploadTranscodedImage(thumbnail: File, path: string, replace = true) {
    const buffer = await thumbnail.arrayBuffer();

    const webpBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();

    const transcoded = new File([new Uint8Array(webpBuffer)], 'image.webp', {
        type: 'image/webp',
    });

    return await uploadFile(transcoded, path, replace);
}

registerFont(path.join(process.cwd(), 'public/fonts/Archivo-Black.ttf'), {
    family: 'Archivo',
    weight: '900'
});

registerFont(path.join(process.cwd(), 'public/fonts/Archivo-Light.ttf'), {
    family: 'Archivo',
    weight: '300'
});

registerFont(path.join(process.cwd(), 'public/fonts/Archivo_SemiCondensed-Thin.ttf'), {
    family: 'Archivo',
    weight: '100'
});

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let maxRenderedWidth = 0;
    let lineCount = 0;

    for (const word of words) {
        const testLine = line + word + ' ';
        const { width } = ctx.measureText(testLine);

        if (width > maxWidth && line !== '') {
            const lineWidth = ctx.measureText(line.trim()).width;
            maxRenderedWidth = Math.max(maxRenderedWidth, lineWidth);
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }

    const lastLine = line.trim();
    const lastLineWidth = ctx.measureText(lastLine).width;
    maxRenderedWidth = Math.max(maxRenderedWidth, lastLineWidth);
    ctx.fillText(lastLine, x, currentY);
    lineCount++;

    return {
        endX: x + lastLineWidth,
        endY: currentY,
        width: maxRenderedWidth,
        height: lineHeight * lineCount,
        lines: lineCount,
    };
}

async function renderOG(title: string, description: string, createdAt: Date, idOrImage?: File | string, author: string = 'bouncytorch') {
    const width = 1200,
        height = 700,
        padding_x = 54,
        padding_y = 44;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // bg color
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // image
    try {
        let buffer;

        if (idOrImage) {
            if (idOrImage instanceof File) {
                buffer = await idOrImage.arrayBuffer();
            }
            else if (typeof idOrImage === 'string') {
                const response = await fetch(getRelativeURL(`/bouncytorch/blog/thumbnails/${idOrImage}.webp`));
                if (!response.ok) throw new Error('No thumbnail, skipping.');
                buffer = await response.arrayBuffer();
            }

            const img = await loadImage((await sharp(buffer)
                .ensureAlpha()
                .png()
                .toBuffer({ resolveWithObject: true })).data);
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            let drawW: number, drawH: number;
            if (imgAspect > canvasAspect) {
                drawH = height;
                drawW = img.width * (height / img.height);
            } else {
                drawW = width;
                drawH = img.height * (width / img.width);
            }
            const drawX = (width - drawW) / 2;
            const drawY = (height - drawH) / 2;
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.globalAlpha = 1.0;
        }
    }
    catch (err) { console.error(err); }

    // shadow
    // top
    let grad = ctx.createLinearGradient(0, 0, 0, height/10);
    grad.addColorStop(0, 'rgba(0,0,0,0.2');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    // bottom
    grad = ctx.createLinearGradient(0, height, 0, height - height/10);
    grad.addColorStop(0, 'rgba(0,0,0,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    // left
    grad = ctx.createLinearGradient(0, 0, width/15, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    // right
    grad = ctx.createLinearGradient(width, 0, width - width/15, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // text
    ctx.fillStyle = '#000000';
    let line_height;

    // title
    line_height = 64;
    ctx.font = '900 64px Archivo';
    const { endY } = wrapText(ctx, title, padding_x, line_height + padding_y, width - padding_x * 2, line_height);

    // description
    line_height = 32;
    ctx.font = '300 32px Archivo';
    wrapText(ctx, description, padding_x, line_height + endY, width - padding_x * 2, line_height);

    // bottom text
    ctx.font = '100 32px Archivo';

    // author
    ctx.fillText(`by ${author}`, padding_x, height - padding_y);
    // date
    const dateString = createdAt.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateWidth = ctx.measureText(dateString).width;
    ctx.fillText(dateString, width - dateWidth - padding_x, height - padding_y);

    return canvas.toBuffer('image/png');
}

export async function createBlog(data: InferCreationAttributes<Blog, { omit: 'id' | 'createdAt' | 'updatedAt' }>, thumbnail?: File) {
    await requireAdmin();
    const blog = await Blog.create(data);
    invalidate(blog.id, blog.tags);
    if (thumbnail) {
        await uploadTranscodedImage(thumbnail, `/bouncytorch/blog/thumbnails/${blog.id}.webp`);
        await uploadFile(new File([new Uint8Array(
            await renderOG(blog.title, blog.description, blog.createdAt, thumbnail)
        )], ''), `/bouncytorch/blog/og/${blog.id}.png`, true);
    }
    else {
        await uploadFile(new File([new Uint8Array(
            await renderOG(blog.title, blog.description, blog.createdAt)
        )], ''), `/bouncytorch/blog/og/${blog.id}.png`, true);
    }

    return blog.toJSON();
}

export async function updateBlog(id: string, data: Partial<InferAttributes<Blog>>, thumbnail?: File) {
    await requireAdmin();
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Not found');

    // Capture OG-relevant fields BEFORE the update
    const prevTitle       = blog.title;
    const prevDescription = blog.description;

    await blog.update(data);
    invalidate(id, blog.tags);

    // Check whether any OG-relevant field actually changed
    const ogFieldChanged =
        thumbnail !== undefined ||
        blog.title       !== prevTitle ||
        blog.description !== prevDescription;

    if (ogFieldChanged) {
        if (thumbnail) {
            await uploadTranscodedImage(thumbnail, `/bouncytorch/blog/thumbnails/${blog.id}.webp`);
            await uploadFile(new File([new Uint8Array(
                await renderOG(blog.title, blog.description, blog.createdAt, thumbnail)
            )], ''), `/bouncytorch/blog/og/${blog.id}.png`, true);
        } else {
            await uploadFile(new File([new Uint8Array(
                await renderOG(blog.title, blog.description, blog.createdAt, blog.id)
            )], ''), `/bouncytorch/blog/og/${blog.id}.png`, true);
        }
    }

    return blog.toJSON();
}

export async function deleteBlog(id: string) {
    await requireAdmin();
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Not found');
    await blog.destroy();
    invalidate(id, blog.tags);
}

export async function uploadBlogImage(id: string, image: File) {
    await requireAdmin();
    return await uploadTranscodedImage(image, `/bouncytorch/blog/${id}/${image.name.replace(/\.[^/.]+$/, '') + '.webp'}`, false);
}

export async function getAnyBlog(id: string) {
    await requireAdmin();
    return Blog.findByPk(id).then(r => r?.toJSON() ?? null);
}

export async function searchAllBlogs(term: string, state?: BlogState) {
    await requireAdmin();
    return sequelize.query(
        `SELECT id, title, description, state, "createdAt",
                ts_rank(search_vector, websearch_to_tsquery('english', :term)) AS rank
         FROM   "blogs"
         WHERE  search_vector @@ websearch_to_tsquery('english', :term)
           ${state ? 'AND state = :state' : ''}
         ORDER  BY rank DESC, "createdAt" DESC`,
        { replacements: { term, ...(state && { state }) }, type: QueryTypes.SELECT },
    );
}

export async function getAllBlogs(limit = 10, offset = 0) {
    await requireAdmin();
    return await Blog.findAndCountAll({ limit, offset })
        .then(r => ({ rows: r.rows.map(v => v.toJSON()), count: r.count }));
}
