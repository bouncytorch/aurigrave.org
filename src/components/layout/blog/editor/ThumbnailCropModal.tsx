'use client';

import { useRef, useState } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '../../Modal';

interface Props {
    file: File;
    onConfirm: (cropped: File) => void;
    onCancel: () => void;
}

/**
 * Draws the selected crop region onto an offscreen canvas and returns a File.
 * Scales by naturalWidth/naturalHeight so the result is full-resolution.
 */
function getCroppedFile(img: HTMLImageElement, crop: PixelCrop, originalFile: File): Promise<File> {
    const scaleX = img.naturalWidth  / img.width;
    const scaleY = img.naturalHeight / img.height;

    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(crop.width  * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
        img,
        crop.x * scaleX, crop.y * scaleY,
        crop.width * scaleX, crop.height * scaleY,
        0, 0,
        canvas.width, canvas.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return reject(new Error('Canvas toBlob failed'));
                resolve(new File([blob], originalFile.name, { type: 'image/png' }));
            },
            'image/png',
        );
    });
}

export default function ThumbnailCropModal({ file, onConfirm, onCancel }: Props) {
    const imgRef    = useRef<HTMLImageElement>(null);
    const srcUrl    = useRef(URL.createObjectURL(file));

    // Start with an 80 % centred selection so the user has something to drag
    const [crop,          setCrop]          = useState<Crop>({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [working,       setWorking]       = useState(false);

    async function handleConfirm() {
        if (!imgRef.current || !completedCrop) return;
        setWorking(true);
        try {
            const cropped = await getCroppedFile(imgRef.current, completedCrop, file);
            URL.revokeObjectURL(srcUrl.current);
            onConfirm(cropped);
        } catch (err) {
            alert(`Crop failed: ${String(err)}`);
        } finally {
            setWorking(false);
        }
    }

    function handleCancel() {
        URL.revokeObjectURL(srcUrl.current);
        onCancel();
    }

    return (
        <Modal onClose={() => onCancel()}>
            <p style={{ margin: 0, fontWeight: 600 }}>Crop thumbnail</p>

            {/* No `aspect` prop → completely free-form */}
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                minWidth={4}
                minHeight={4}
            >
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                    ref={imgRef}
                    src={srcUrl.current}
                    alt="Crop preview"
                    style={{ maxWidth: '80vw', maxHeight: '65vh', display: 'block' }}
                />
            </ReactCrop>

            <small style={{ opacity: 0.6 }}>
                Drag to reposition · Drag corners/edges to resize · No aspect ratio enforced
            </small>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCancel} disabled={working}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={working || !completedCrop || completedCrop.width === 0}
                >
                    {working ? 'Cropping…' : 'Confirm crop'}
                </button>
            </div>
        </Modal>

    );
}
