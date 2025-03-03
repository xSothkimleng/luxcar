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

// Car color options
const CAR_COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'silver', label: 'Silver' },
  { value: 'gray', label: 'Gray' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'brown', label: 'Brown' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
];

const CAR_BRANDS = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'ford', label: 'Ford' },
  { value: 'chevrolet', label: 'Chevrolet' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'kia', label: 'Kia' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes-benz', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
];

const CarForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [carImages, setCarImages] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !price || !color || !description) {
      setError('Please fill in all required fields');
      return;
    }

    if (carImages.length === 0) {
      setError('Please upload at least one car image');
      return;
    }

    // Validate price is a number
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    try {
      setIsSubmitting(true);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Submitting car data:', {
        name,
        price: Number(price),
        color,
        description,
        images: carImages.map(img => img.name),
      });

      // Show success message
      setSuccessMessage('Car added successfully!');

      // Close the form after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
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

  const handleImagesChange = (files: File[]) => {
    console.log('Car images selected:', files);
    setCarImages(files);
    setError(null);
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      {error && (
        <Alert severity='error' className='mb-4'>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
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
          {/* Car Color Dropdown */}
          <FormControl fullWidth className='mb-4'>
            <InputLabel id='car-color-label'>Color</InputLabel>
            <Select required labelId='car-color-label' id='car-color' value={color} label='Color' onChange={handleColorChange}>
              {CAR_COLORS.map(colorOption => (
                <MenuItem key={colorOption.value} value={colorOption.value}>
                  {colorOption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {/* Car Color Dropdown */}
          <FormControl fullWidth className='mb-4'>
            <InputLabel id='car-color-label'>Brand</InputLabel>
            <Select required labelId='car-color-label' id='car-color' value={color} label='Color' onChange={handleColorChange}>
              {CAR_BRANDS.map(brandOption => (
                <MenuItem key={brandOption.value} value={brandOption.value}>
                  {brandOption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {/* Car Images with Preview */}
          <Box className='mb-4' style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
            <MultiFileUpload
              maxSize={5 * 1024 * 1024}
              accept='image/jpeg,image/png,image/webp'
              onFilesSelected={handleImagesChange}
              multiple={true}
              files={carImages}
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
          disabled={isSubmitting || !name || !price || !color || !description || carImages.length === 0}>
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
