import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Collapse } from '@mui/material';

export interface ImageInfo {
    image: File;
    caption: string;
}

export interface ImageUploadCarouselProps {
    onImageInfoChange: (imageInfo: ImageInfo[]) => void;
}

export default function ImageUploadCarousel({ onImageInfoChange }: ImageUploadCarouselProps) {
    const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newCaption, setNewCaption] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewImage(files[0]);
        }
    };

    const handleCaptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewCaption(e.target.value);
    };

    const handleCaptionChangeForImage = (
        e: any,
        index: number
    ) => {
        const updatedImages = [...selectedImages];
        updatedImages[index].caption = e.target.value;
        setSelectedImages(updatedImages);
    };


    const addImage = () => {
        if (newImage) {
            setSelectedImages([
                ...selectedImages,
                { image: newImage, caption: newCaption },
            ]);
            setNewImage(null);
            setNewCaption('');
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    useEffect(() => {
        onImageInfoChange(selectedImages);
    }, [selectedImages, onImageInfoChange]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload-input"
            />
            <label htmlFor="image-upload-input">
                <Button
                    variant="outlined"
                    component="span"
                >
                    Select Image
                </Button>
            </label>
            {newImage && (
                <Typography variant="body2">
                    Selected: {newImage.name}
                </Typography>
            )}
            <TextField
                label="Caption"
                value={newCaption}
                onChange={handleCaptionChange}
                fullWidth
            />
            <Button
                variant="contained"
                onClick={addImage}
                disabled={!newImage}
            >
                Add Image
            </Button>
            <Grid container spacing={2}>
                {selectedImages.map((imageInfo, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <div>
                            <img
                                src={URL.createObjectURL(imageInfo.image)}
                                alt={`Selected ${index + 1}`}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        <TextField
                            label="Caption"
                            value={imageInfo.caption}
                            fullWidth
                            onChange={(e) =>
                                handleCaptionChangeForImage(e, index)
                            }
                        />
                        <Button
                            variant="outlined"
                            onClick={() => removeImage(index)}
                        >
                            Remove
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

