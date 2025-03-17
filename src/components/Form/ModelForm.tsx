'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import FileUpload from '@/components/UploadButton';
import { Model } from '@/types/model';
import { useCreateModel, useUpdateModel } from '@/hooks/useModel';
import Image from 'next/image';

interface ModelFormProps {
  model?: Model; // Optional model for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for success
}

const ModelForm = ({ model, isEdit = false, onClose, onSuccess }: ModelFormProps) => {
  // Form state
  const [name, setName] = useState('');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks for creating and updating
  const { mutateAsync: createModel, isPending: isCreating } = useCreateModel();
  const { mutateAsync: updateModel, isPending: isUpdating } = useUpdateModel();

  // Determine if form is currently submitting
  const isSubmitting = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (isEdit && model) {
      setName(model.name);
      if (model.imageUrl) {
        setExistingImageUrl(model.imageUrl);
        setKeepExistingImage(true);
      }
    }
  }, [isEdit, model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setError('Model name is required');
      return;
    }

    try {
      if (isEdit && model) {
        // Update existing model
        await updateModel({
          id: model.id,
          modelData: { name },
          imageFile: modelImage,
          deleteCurrentImage: !keepExistingImage,
        });
        setSuccessMessage('Model updated successfully!');
      } else {
        // Create new model
        await createModel({
          modelData: { name },
          imageFile: modelImage,
        });
        setSuccessMessage('Model created successfully!');
      }

      // If success callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }

      // Clear form after success for new model (optional)
      if (!isEdit) {
        setName('');
        setModelImage(null);
      }

      onClose();
    } catch (err) {
      console.error('Error saving model:', err);
      setError(err instanceof Error ? err.message : 'Failed to save model');
    }
  };

  const handleModelImageChange = (file: File | null) => {
    setModelImage(file);
    setKeepExistingImage(false);
  };

  const handleRemoveExistingImage = () => {
    setKeepExistingImage(false);
    setExistingImageUrl(null);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      {error && (
        <Alert severity='error' className='mb-4' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CoolButton
            required
            label='Model Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? 'Model name is required' : ''}
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body1' gutterBottom>
            Model Logo/Image
          </Typography>

          {/* Show existing image if available and keeping it */}
          {keepExistingImage && existingImageUrl && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  position: 'relative',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                <Image src={existingImageUrl} alt='Model Logo' fill style={{ objectFit: 'contain' }} />
              </Box>
              <Button
                variant='contained'
                color='error'
                size='small'
                onClick={handleRemoveExistingImage}
                sx={{ position: 'absolute', top: 8, right: 8 }}>
                Change
              </Button>
            </Box>
          )}

          {/* Show file upload if no image or removing existing */}
          {(!keepExistingImage || !existingImageUrl) && (
            <Box style={{ border: '1px solid rgba(0, 0, 0, 0.25)', borderRadius: 4 }}>
              <FileUpload
                onFilesSelected={handleModelImageChange}
                maxSize={5 * 1024 * 1024} // 5MB
                accept='image/jpeg,image/png,image/webp,image/svg+xml'
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Form Buttons */}
      <Box className='flex justify-end gap-4 mt-8'>
        <Button variant='outlined' onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          variant='contained'
          type='submit'
          disabled={isSubmitting || !name.trim()}
          sx={{
            borderRadius: '8px',
            minWidth: '100px',
          }}>
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : isEdit ? (
            'Update Model'
          ) : (
            'Create Model'
          )}
        </Button>
      </Box>

      {/* Success Message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity='success' onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ModelForm;
