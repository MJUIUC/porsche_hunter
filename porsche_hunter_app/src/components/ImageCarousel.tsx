import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ImageCapture {
  authorId: string;
  caption: string;
  huntResultPostId: string;
  id?: number;
  imageUrl: string;
  model: string;
  type: string;
  uuid: string;
}

interface ImageCarouselProps {
  images: ImageCapture[];
  onUpdateImageList: (updatedImages: ImageCapture[]) => void;
}

export default function ImageCarousel ({ images, onUpdateImageList }: ImageCarouselProps) {
  const [imageList, setImageList] = useState<ImageCapture[]>(images);

  const handleRemoveImage = (id: number) => {
    // Check if there's only one image left before removing
    if (imageList.length === 1) {
      return;
    }

    const updatedImages = imageList.filter((image) => image.id !== id);
    setImageList(updatedImages);

    // Callback to update the parent component with the new image list
    onUpdateImageList(updatedImages);
  };

  const handleEditCaption = (id: number, newCaption: string) => {
    const updatedImages = imageList.map((image) => {
      if (image.id === id) {
        return { ...image, caption: newCaption };
      }
      return image;
    });
    setImageList(updatedImages);

    // Callback to update the parent component with the new image list
    onUpdateImageList(updatedImages);
  };

  return (
    <div>
      <Grid container spacing={2}>
        {imageList.map((image, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <img src={image.imageUrl} alt={image.caption} style={{ width: '100%' }} />
              <CardContent>
                <TextField
                  label="Caption"
                  fullWidth
                  value={image.caption}
                  onChange={(e) => handleEditCaption(image.id || 0, e.target.value)}
                />
              </CardContent>
              <CardActions>
                {/* Disable the delete button if there's only one image left */}
                <IconButton
                  onClick={() => handleRemoveImage(image.id || 0)}
                  disabled={imageList.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
