import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import sequelize from '@/lib/db';

export enum BlogState {
    Draft     = 'draft',
    Unlisted  = 'unlisted',
    Published = 'published',
}

// "YYYYMMDDHHmmss"
const generateBlogId = (): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
        `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    );
};

// Soft-fail: the view is a cache; a stale view beats a broken write
const refreshUniqueBlogTags = async (): Promise<void> => {
    try {
        // CONCURRENTLY must NOT run inside an open transaction — use a fresh connection
        await sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY unique_blog_tags');
    } catch (err) {
        console.error('[Blog] Failed to refresh unique_blog_tags:', err);
    }
};

class Blog extends Model<
    InferAttributes<Blog>,
    InferCreationAttributes<Blog>
> {
    declare id:            CreationOptional<string>;
    declare title:         string;
    declare description:   string;
    declare content:       string;
    declare keywords:      CreationOptional<string[]>;
    declare tags:          CreationOptional<string[]>;
    declare showThumbnail: CreationOptional<boolean>;
    declare state:         CreationOptional<BlogState>;
    declare createdAt:     CreationOptional<Date>;
    declare updatedAt:     CreationOptional<Date>;
}

Blog.init({
    id: {
        type: DataTypes.STRING(14),
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING(72)),
        allowNull: false,
        defaultValue: [],
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING(48)),
        allowNull: false,
        defaultValue: [],
    },
    showThumbnail: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    state: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: BlogState.Draft,
        validate: { isIn: [Object.values(BlogState)] },
    },
    createdAt: '',
    updatedAt: ''
}, {
    sequelize,
    modelName:    'Blog',
    tableName:    'blogs',
    timestamps:   true,
    defaultScope: { order: [['createdAt', 'DESC']] },
    indexes: [
        // NOTE: search_vector is a generated column - not declared in this model.
        // Its GIN index is created in the migration only.
        { name: 'blogs_tags_gin', using: 'GIN', fields: ['tags'] },
    ],
});

Blog.beforeValidate((blog) => {
    if (!blog.id) blog.id = generateBlogId();
});

// Refresh the unique-tags view after any write that could change tags
Blog.afterSave(refreshUniqueBlogTags);
Blog.afterDestroy(refreshUniqueBlogTags);
Blog.afterBulkCreate(refreshUniqueBlogTags);
Blog.afterBulkUpdate(refreshUniqueBlogTags);
Blog.afterBulkDestroy(refreshUniqueBlogTags);

export default Blog;
