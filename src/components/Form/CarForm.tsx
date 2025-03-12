'use client';
import * as React from 'react';
import { useState } from 'react';
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
} from '@mui/material';
import CoolButton from '@/components/CustomButton';
import MultiFileUpload from '@/components/MultiFileUpload';
import RichTextEditor from '../RichTextEditor';
import FileUpload from '../UploadButton';
import { useBrands } from '@/hooks/useBrand';
import { useColors } from '@/hooks/useColor';
import { useModels } from '@/hooks/useModel';
import { useCreateCar } from '@/hooks/useCar';
import { uploadImage } from '@/services/carService';

const CarForm = ({ onClose }: { onClose: () => void }) => {
  // Fetch data from API
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colors, isLoading: colorsLoading } = useColors();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { mutateAsync: createCar } = useCreateCar();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [scale, setScale] = useState('');
  const [colorId, setColorId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [variantImages, setVariantImages] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !price || !scale || !colorId || !brandId || !modelId || !description) {
      setError('Please fill in all required fields');
      return;
    }

    if (!thumbnailImage) {
      setError('Please upload a thumbnail image');
      return;
    }

    if (variantImages.length === 0) {
      setError('Please upload at least one variant image');
      return;
    }

    // Validate price is a number
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload thumbnail first
      const thumbnailUpload = await uploadImage(thumbnailImage, 'thumbnail');

      // 2. Create car with thumbnail ID
      const newCar = await createCar({
        name,
        price: Number(price),
        scale,
        description,
        colorId,
        brandId,
        modelId,
        thumbnailImageId: thumbnailUpload.id,
      });

      await Promise.all(variantImages.map(file => uploadImage(file, 'variant', newCar.id)));

      setSuccessMessage('Car added successfully!');

      onClose();
    } catch (err) {
      console.error('Error adding car:', err);
      setError(err instanceof Error ? err.message : 'Failed to add car');
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
    setError(null);
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
            onChange={e => setPrice(e.target.value)}
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
          <Box style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
            <FileUpload
              onFilesSelected={handleThumbnailChange}
              maxSize={5 * 1024 * 1024} // 5MB
              accept='image/jpeg,image/png,image/webp'
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1'>Images Variants</Typography>
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
            !thumbnailImage ||
            variantImages.length === 0
          }>
          {isSubmitting ? 'Adding Car...' : 'Add Car'}
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

export default CarForm;
