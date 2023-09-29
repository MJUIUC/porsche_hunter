import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button } from '@mui/material';
import { Dropdown } from '@mui/base';
import ImageUploadCarousel, { ImageInfo } from './ImageUploadCarousel';
import { useAuthentication } from '../hooks/UseAuthentication';
import PorscheModelTypeaheadList, { CarData } from './PorscheModelTypeahaedList';
import ImageCarousel, { ImageCapture } from './ImageCarousel';

export interface PostCreatorProps {
  editPost?: {
    title: string;
    location: string;
    blogContent: string;
    author: any;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    id?: number;
    isPrivate: boolean;
    uuid: string;
    captures: ImageCapture[];
    vehicleModel: CarData;
  }
};

export default function PostCreator({ editPost }: PostCreatorProps) {
  const [title, setTitle] = useState<string>(editPost?.title ||'');
  const [location, setLocation] = useState<string>(editPost?.location ||'');
  const [blogContent, setBlogContent] = useState<string>(editPost?.blogContent ||'');
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<CarData | null>(editPost?.vehicleModel || null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);

  // edit states
  const [editedCaptures, setEditedCaptures] = useState<ImageCapture[]>(editPost?.captures || []);

  const navigate = useNavigate();
  // console.log(editPost)
  const { getCookie } = useAuthentication();
  const jwt = getCookie('jwt');

  const popGeoLocation = () => {
    if ('geolocation' in navigator) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          // Handle geolocation error
          console.error('Geolocation error:', error);
          setLocation('Geolocation disabled');
        }
      );
    } else {
      // Geolocation is not available
      setLocation('Geolocation not supported');
    }
  };

  // Check and set location on component mount
  useEffect(() => {
    if (editPost) return;
    popGeoLocation();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleBlogContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogContent(e.target.value);
  };

  const handleImageInfoChange = useCallback((imageInfo: ImageInfo[]) => {
    // only update if the imageInfo is different
    if (JSON.stringify(imageInfo) !== JSON.stringify(selectedImages)) {
      setSelectedImages(imageInfo);
    }
  }, [selectedImages]);

  const handleUploadImages = async () => {

    function uploadImage(file: File): Promise<string> {
      return new Promise((resolve, reject) => {

        const formData = new FormData();
        formData.append('files', file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            console.log(`Uploading image ${file.name}: ${percentage}%`);
            setImageUploadProgress(percentage);
          }
        });

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // Upload is complete
              setImageUploadProgress(100);
              console.log('Upload successful', xhr.response);
              const uploadResult = JSON.parse(xhr.response).files[0];
              resolve(uploadResult);
            } else {
              console.error('Upload failed');
              reject(xhr.response);
            }
          }
        };

        xhr.open('POST', '/mini-cdn/upload_image', true);
        xhr.setRequestHeader('Authorization', `${jwt}`);
        xhr.send(formData);
      });
    }

    return Promise.all(selectedImages.map(async (imageInfo: ImageInfo) => {
      const cdnFilename = await uploadImage(imageInfo.image);
      // TODO: get base url from env variable
      const cdnUrl = `http://localhost:8080/mini-cdn/image/${cdnFilename}`;
      return {
        ...imageInfo,
        cdnUrl,
      };
    }));
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) alert('Please select at least one image');
    // console.log('Submit')
    // Once upload is finished, we should have the CDN URLs of the images.
    try {
      const uploadResult = await handleUploadImages();
      console.log(uploadResult);
      const captures = uploadResult.map((item) => {
        return { url: item.cdnUrl, caption: item.caption };
      });

      // Need to make a request to the server to create the post now that we have the CDN URLs
      const response = await fetch('/api/v1/post/publish_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwt}`,
        },
        body: JSON.stringify({
          title,
          location,
          blogContent,
          captures,
          vehicleModel: selectedModel,
        }),
      });
      const result = await response.json();
      navigate(`/post/${result.uuid}`);
      // console.log(result);
    } catch (error) {
      alert(`You probably need to login first. ${JSON.stringify(error)}`)
      console.log(error);
    }
    // Implement logic to create a HuntResultsPost and associated AutomobileCaptures
    // You'll need to make an API request to your server to handle database operations.
    // Include the CDN URLs of the uploaded images in the request.
  };

  const handleEditSubmit = async () => {};

  const handlePorscheModelSelect = (selectedItem: CarData) => {
    setSelectedModel(selectedItem);
  };

  const handleEditedImages = (images: ImageCapture[]) => {
    // console.log(images)
    setEditedCaptures(images)
  };
  console.log(editedCaptures)
  return (
    <Container maxWidth="md">
      <form>
        {editPost? <ImageCarousel onUpdateImageList={handleEditedImages} images={editPost.captures}/>: <></>}
        <ImageUploadCarousel onImageInfoChange={handleImageInfoChange} />
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          label="Location"
          fullWidth
          margin="normal"
          value={location}
          onChange={handleLocationChange}
          disabled={location !== 'Geolocation not supported'}
        />
        {editPost ? <Button variant="contained" color="primary" onClick={popGeoLocation}>Use Current Location</Button> : <></>}
        <TextField
          label="Blog Content"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={blogContent}
          onChange={handleBlogContentChange}
        />
        <PorscheModelTypeaheadList item={editPost?.vehicleModel} onSelect={handlePorscheModelSelect} />
        <Button
          variant="contained"
          color="primary"
          onClick={editPost? handleEditSubmit : handleSubmit}
          disabled={editPost? (!title || !blogContent) : (!title || !blogContent || selectedImages.length === 0)}
        >
          {editPost? 'Update ' : 'Create '}
          Hunt Results Post
        </Button>
      </form>
    </Container>
  );
}
