/* eslint-disable @next/next/no-img-element */
'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  CircularProgress,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CoolButton from '@/components/CustomButton';
import MultiFileUpload from '@/components/MultiFileUpload';
import RichTextEditor from '../RichTextEditor';
import FileUpload from '../UploadButton';
import { useBrands } from '@/hooks/useBrand';
import { useColors } from '@/hooks/useColor';
import { useModels } from '@/hooks/useModel';
import { useUpdateCar } from '@/hooks/useCar';
import { uploadImage, deleteVariantImage } from '@/services/carService';
import { Car } from '@/types/car';

interface CarEditFormProps {
  car: Car;
  onClose: () => void;
}

// Predefined tag options
const tagOptions = ['IN STOCK', 'RELEASED', 'Pre-Order', 'SOLD OUT', 'COMING SOON'];

const CarEditForm = ({ car, onClose }: CarEditFormProps) => {
  // Fetch data from API
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colors, isLoading: colorsLoading } = useColors();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { mutateAsync: updateCar } = useUpdateCar();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [scale, setScale] = useState('');
  const [tag, setTag] = useState('');
  const [colorId, setColorId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [description, setDescription] = useState('');

  // Image handling
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [keepExistingThumbnail, setKeepExistingThumbnail] = useState(true);
  const [variantImages, setVariantImages] = useState<File[]>([]);
  const [existingVariantImages, setExistingVariantImages] = useState<Array<{ id: string; url: string }>>([]);

  // UI state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with car data when it's loaded
  useEffect(() => {
    console.log('Setup form with data from useCar');
    if (car) {
      console.log('Car:', car);
      setName(car.name);
      setPrice(car.price);
      setScale(car.scale);
      setTag(car.tag || '');
      setColorId(car.colorId);
      setBrandId(car.brandId);
      setModelId(car.modelId);
      setDescription(car.description);

      // Set existing variant images if available
      if (car.variantImages && car.variantImages.length > 0) {
        setExistingVariantImages(
          car.variantImages.map(img => ({
            id: img.id,
            url: img.url,
          })),
        );
      }
    }
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !price || !scale || !colorId || !brandId || !modelId || !description) {
      setError('Please fill in all required fields');
      return;
    }

    // Need either existing thumbnail or new one
    if (!keepExistingThumbnail && !thumbnailImage && car?.thumbnailImageId) {
      setError('Please provide a thumbnail image');
      return;
    }

    // Need either existing variants or new ones
    if (existingVariantImages.length === 0 && variantImages.length === 0) {
      setError('Please provide at least one variant image');
      return;
    }

    // Validate price is a number
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare update data
      let thumbnailImageId = car?.thumbnailImageId;

      // Handle thumbnail image if it's changed
      if (!keepExistingThumbnail) {
        if (thumbnailImage) {
          // Upload new thumbnail
          const thumbnailUpload = await uploadImage(thumbnailImage, 'thumbnail');
          thumbnailImageId = thumbnailUpload.id;
        } else {
          // Clear thumbnail if removed and no new one
          thumbnailImageId = null;
        }
      }

      // Update the car basic info
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedCar = await updateCar({
        id: car.id,
        name,
        price: Number(price),
        scale,
        tag,
        description,
        colorId,
        brandId,
        modelId,
        thumbnailImageId,
      });

      // Upload any new variant images
      if (variantImages.length > 0) {
        await Promise.all(variantImages.map(file => uploadImage(file, 'variant', car.id)));
      }

      // Show success message
      setSuccessMessage('Car updated successfully!');

      onClose();
    } catch (err) {
      console.error('Error updating car:', err);
      setError(err instanceof Error ? err.message : 'Failed to update car');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionChange = (newContent: string) => {
    setDescription(newContent);
  };

  const handleVariantImagesChange = (files: File[]) => {
    setVariantImages(files);
    setError(null);
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailImage(file);
    setKeepExistingThumbnail(false);
    setError(null);
  };

  const handleRemoveExistingThumbnail = () => {
    setKeepExistingThumbnail(false);
  };

  const handleRemoveVariantImage = async (id: string, index: number) => {
    try {
      // Get the URL from the existingVariantImages array using the index
      const imageUrl = existingVariantImages[index].url;

      // Pass both id and url to the deleteVariantImage function
      await deleteVariantImage(id, imageUrl);

      // Update local state
      const updatedImages = [...existingVariantImages];
      updatedImages.splice(index, 1);
      setExistingVariantImages(updatedImages);
    } catch (err) {
      console.error('Error removing variant image:', err);
      setError('Failed to remove image');
    }
  };

  // Handle dropdown changes
  const handleColorChange = (event: SelectChangeEvent) => {
    setColorId(event.target.value);
  };

  const handleBrandChange = (event: SelectChangeEvent) => {
    setBrandId(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModelId(event.target.value);
  };

  const handleTagChange = (event: React.SyntheticEvent, newValue: string | null) => {
    setTag(newValue || '');
  };

  // Show loading state while fetching car data
  if (!car) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      {error && (
        <Alert severity='error' className='mb-4'>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Car Name */}
          <CoolButton
            required
            label='Car Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
          />
        </Grid>

        <Grid item xs={12}>
          {/* Car Price */}
          <CoolButton
            required
            label='Price ($)'
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            fullWidth
            variant='filled'
            type='number'
            inputProps={{ min: 0, step: 0.01 }}
            className='mb-4'
          />
        </Grid>

        <Grid item xs={12}>
          {/* Car Scale */}
          <CoolButton
            required
            label='Scale (e.g. 1:18)'
            value={scale}
            onChange={e => setScale(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
          />
        </Grid>

        <Grid item xs={12}>
          {/* Tag Field (Autocomplete with free input) */}
          <Autocomplete
            freeSolo
            id='car-tag'
            options={tagOptions}
            value={tag}
            onChange={handleTagChange}
            onInputChange={(event, newInputValue) => {
              setTag(newInputValue);
            }}
            renderInput={params => <TextField {...params} label='Tag' variant='outlined' fullWidth className='mb-4' />}
          />
        </Grid>

        <Grid item xs={12}>
          {/* Color Dropdown */}
          <FormControl fullWidth className='mb-4'>
            <InputLabel id='car-color-label'>Color</InputLabel>
            <Select
              required
              labelId='car-color-label'
              id='car-color'
              value={colorId}
              label='Color'
              onChange={handleColorChange}
              disabled={colorsLoading || !colors?.length}>
              {colors?.map(color => (
                <MenuItem key={color.id} value={color.id}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {/* Brand Dropdown */}
          <FormControl fullWidth className='mb-4'>
            <InputLabel id='car-brand-label'>Brand</InputLabel>
            <Select
              required
              labelId='car-brand-label'
              id='car-brand'
              value={brandId}
              label='Brand'
              onChange={handleBrandChange}
              disabled={brandsLoading || !brands?.length}>
              {brands?.map(brand => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {/* Model Dropdown */}
          <FormControl fullWidth className='mb-4'>
            <InputLabel id='car-model-label'>Model</InputLabel>
            <Select
              required
              labelId='car-model-label'
              id='car-model'
              value={modelId}
              label='Model'
              onChange={handleModelChange}
              disabled={modelsLoading || !models?.length}>
              {models?.map(model => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1'>Thumbnail</Typography>

          {/* Show existing thumbnail if available and keeping it */}
          {keepExistingThumbnail && car?.thumbnailImage && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={car.thumbnailImage.url}
                alt='Current thumbnail'
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                }}
              />
              <Button
                variant='contained'
                color='error'
                size='small'
                onClick={handleRemoveExistingThumbnail}
                sx={{ position: 'absolute', top: 8, right: 8 }}>
                Change
              </Button>
            </Box>
          )}

          {/* Show file upload if no thumbnail or removing existing */}
          {(!keepExistingThumbnail || !car?.thumbnailImage) && (
            <Box style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
              <FileUpload
                onFilesSelected={handleThumbnailChange}
                maxSize={5 * 1024 * 1024} // 5MB
                accept='image/jpeg,image/png,image/webp'
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1'>Images Variants</Typography>

          {/* Display existing variant images */}
          {existingVariantImages.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant='caption' sx={{ mb: 1, display: 'block' }}>
                Current Images:
              </Typography>
              <Grid container spacing={2}>
                {existingVariantImages.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={`existing-${image.id}`}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt={`Variant ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                      <IconButton
                        aria-label='delete'
                        size='small'
                        onClick={() => handleRemoveVariantImage(image.id, index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(211,47,47,0.8)',
                          },
                        }}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Upload new variant images */}
          <Box className='mb-4' style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
            <MultiFileUpload
              maxSize={10 * 1024 * 1024}
              accept='image/jpeg,image/png,image/webp'
              onFilesSelected={handleVariantImagesChange}
              multiple={true}
              files={variantImages}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          {/* Description (Rich Text Editor) */}
          <Box className='mb-4'>
            <Typography variant='body1' className='mb-2'>
              Description
            </Typography>
            <RichTextEditor value={description} onChange={handleDescriptionChange} />
          </Box>
        </Grid>
      </Grid>

      {/* Form Buttons */}
      <Box className='flex justify-end gap-4 mt-8'>
        <Button variant='outlined' onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant='contained'
          type='submit'
          disabled={
            isSubmitting ||
            !name ||
            !price ||
            !scale ||
            !colorId ||
            !brandId ||
            !modelId ||
            !description ||
            (existingVariantImages.length === 0 && variantImages.length === 0) ||
            (!keepExistingThumbnail && !thumbnailImage && !!car?.thumbnailImageId)
          }>
          {isSubmitting ? 'Updating Car...' : 'Update Car'}
        </Button>
      </Box>

      {/* Success Message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity='success'>{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CarEditForm;
