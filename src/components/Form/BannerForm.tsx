'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Grid } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import FileUpload from '@/components/UploadButton';
import { uploadBannerImage } from '@/services/bannerService';
import { useCreateBannerSlide, useUpdateBannerSlide } from '@/hooks/useBanner';
import { BannerSlideFormData } from '@/types/banner';

interface BannerSlideFormProps {
  slideId?: string; // Optional ID for editing
  initialData?: BannerSlideFormData;
  onClose: () => void;
  onSuccess?: () => void;
}

const BannerSlideForm = ({ slideId, initialData, onClose, onSuccess }: BannerSlideFormProps) => {
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [bgImage, setBgImage] = useState<File | null>(null);

  // For editing: track existing images
  const [existingMainImageId, setExistingMainImageId] = useState<string | null>(null);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(null);
  const [existingBgImageId, setExistingBgImageId] = useState<string | null>(null);
  const [existingBgImageUrl, setExistingBgImageUrl] = useState<string | null>(null);

  // Keep track if we're replacing existing images
  const [replaceMainImage, setReplaceMainImage] = useState(false);
  const [replaceBgImage, setReplaceBgImage] = useState(false);

  // Mutation hooks
  const { mutateAsync: createSlide, isPending: isCreating } = useCreateBannerSlide();
  const { mutateAsync: updateSlide, isPending: isUpdating } = useUpdateBannerSlide();

  // UI state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSubtitle(initialData.subtitle || '');

      if (initialData.mainImage) {
        setExistingMainImageId(initialData.mainImage.id);
        setExistingMainImageUrl(initialData.mainImage.url);
      }

      if (initialData.bgImage) {
        setExistingBgImageId(initialData.bgImage.id);
        setExistingBgImageUrl(initialData.bgImage.url);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!title || !subtitle) {
      setError('Please fill in all required fields');
      return;
    }

    // Need either existing main image or new one
    if (!existingMainImageId && !mainImage) {
      setError('Please provide a main image');
      return;
    }

    // Need either existing background image or new one
    if (!existingBgImageId && !bgImage) {
      setError('Please provide a background image');
      return;
    }

    try {
      // Handle image uploads first
      let mainImageId = existingMainImageId;
      let bgImageId = existingBgImageId;

      // If replacing or adding new main image
      if ((replaceMainImage || !existingMainImageId) && mainImage) {
        const mainImageUpload = await uploadBannerImage(mainImage, 'main');
        mainImageId = mainImageUpload.id;
      }

      // If replacing or adding new background image
      if ((replaceBgImage || !existingBgImageId) && bgImage) {
        const bgImageUpload = await uploadBannerImage(bgImage, 'background');
        bgImageId = bgImageUpload.id;
      }

      // Create or update the banner slide
      if (slideId) {
        // Update existing slide
        await updateSlide({
          id: slideId,
          title,
          subtitle,
          mainImageId: mainImageId!,
          bgImageId: bgImageId!,
        });
        setSuccessMessage('Banner slide updated successfully!');
      } else {
        // Create new slide
        await createSlide({
          title,
          subtitle,
          mainImageId: mainImageId!,
          bgImageId: bgImageId!,
        });
        setSuccessMessage('Banner slide created successfully!');
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving banner slide:', err);
      setError(err instanceof Error ? err.message : 'Failed to save banner slide');
    }
  };

  const handleMainImageChange = (file: File | null) => {
    setMainImage(file);
    setReplaceMainImage(true);
    setError(null);
  };

  const handleBgImageChange = (file: File | null) => {
    setBgImage(file);
    setReplaceBgImage(true);
    setError(null);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      {error && (
        <Alert severity='error' className='mb-4' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Title */}
          <CoolButton
            required
            label='Slide Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
          />
        </Grid>

        <Grid item xs={12}>
          {/* Subtitle */}
          <CoolButton
            required
            label='Slide Subtitle'
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1'>Main Image</Typography>

          {/* Show existing main image if available and not replacing */}
          {existingMainImageUrl && !replaceMainImage && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={existingMainImageUrl}
                alt='Current main image'
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
                onClick={() => setReplaceMainImage(true)}
                sx={{ position: 'absolute', top: 8, right: 8 }}>
                Change
              </Button>
            </Box>
          )}

          {/* Show file upload if no existing image or replacing */}
          {(!existingMainImageUrl || replaceMainImage) && (
            <Box style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
              <FileUpload
                onFilesSelected={handleMainImageChange}
                maxSize={5 * 1024 * 1024} // 5MB
                accept='image/jpeg,image/png,image/webp'
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1'>Background Image</Typography>

          {/* Show existing background image if available and not replacing */}
          {existingBgImageUrl && !replaceBgImage && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={existingBgImageUrl}
                alt='Current background image'
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
                onClick={() => setReplaceBgImage(true)}
                sx={{ position: 'absolute', top: 8, right: 8 }}>
                Change
              </Button>
            </Box>
          )}

          {/* Show file upload if no existing image or replacing */}
          {(!existingBgImageUrl || replaceBgImage) && (
            <Box style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
              <FileUpload
                onFilesSelected={handleBgImageChange}
                maxSize={5 * 1024 * 1024} // 5MB
                accept='image/jpeg,image/png,image/webp'
              />
            </Box>
          )}
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
            isSubmitting || !title || !subtitle || (!existingMainImageId && !mainImage) || (!existingBgImageId && !bgImage)
          }>
          {isSubmitting ? (slideId ? 'Updating...' : 'Creating...') : slideId ? 'Update Slide' : 'Create Slide'}
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

export default BannerSlideForm;
