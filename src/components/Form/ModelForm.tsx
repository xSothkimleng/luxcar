'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import FileUpload from '@/components/UploadButton';
import { Model } from '@/types/model';
import { useCreateModel, useModels, useUpdateModel } from '@/hooks/useModel';
import Image from 'next/image';

interface ModelFormProps {
  model?: Model;
  isEdit?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModelForm = ({ model, isEdit = false, onClose, onSuccess }: ModelFormProps) => {
  // Form state
  const [name, setName] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Fetch all colors for validation
  const { data: models = [] } = useModels();

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
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
      setOrder(model.order || 0);
      if (model.imageUrl) {
        setExistingImageUrl(model.imageUrl);
        setKeepExistingImage(true);
      }
    }
  }, [isEdit, model]);

  useEffect(() => {
    validateOrderSequence(order);
  }, [order, models]);

  // Function to validate if the order sequence is unique
  const validateOrderSequence = (orderValue: number) => {
    // Clear previous order error
    setOrderError(null);

    // Skip validation if we're editing and the order hasn't changed
    if (isEdit && model && orderValue === model.order) {
      return true;
    }

    // Check if any existing model has the same order
    const existingModelWithSameOrder = models.find(m => {
      // Convert order to number for comparison since it might be coming from API as string
      const modelOrder = typeof m.order === 'string' ? parseInt(m.order) : m.order;

      // Check if this model has the same order and is not the current model being edited
      return modelOrder === orderValue && (!isEdit || m.id !== model?.id);
    });

    if (existingModelWithSameOrder) {
      setOrderError(`Order ${orderValue} is already assigned to "${existingModelWithSameOrder.name}"`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setError('Model name is required');
      return;
    }

    // Validate order sequence one more time before submitting
    if (!validateOrderSequence(order)) {
      setError('Please fix the order sequence issue');
      return;
    }

    try {
      if (isEdit && model) {
        // Update existing model
        await updateModel({
          id: model.id,
          modelData: { name, order },
          imageFile: modelImage,
          deleteCurrentImage: !keepExistingImage,
        });
        setSuccessMessage('Model updated successfully!');
      } else {
        // Create new model
        await createModel({
          modelData: { name, order },
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
        setOrder(0);
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

  // Find the next available order number
  const getNextAvailableOrder = () => {
    if (models.length === 0) return 1;

    // Get all order numbers
    const orderNumbers = models
      .map(m => m.order)
      .filter((model): model is number => model !== null && model !== undefined)
      .sort((a, b) => a - b);

    // Find the next available slot
    let nextOrder = 1;
    for (const order of orderNumbers) {
      if (order > nextOrder) {
        break;
      }
      nextOrder = order + 1;
    }

    return nextOrder;
  };

  // Handle using suggested order
  const handleUseNextAvailableOrder = () => {
    const nextOrder = getNextAvailableOrder();
    setOrder(nextOrder);
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
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CoolButton
              label='Order Sequence'
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              fullWidth
              variant='filled'
              type='number'
              className='mb-1'
              error={!!orderError}
              helperText={orderError || ''}
              disabled={isSubmitting}
            />
            {orderError && (
              <Button
                variant='text'
                color='primary'
                onClick={handleUseNextAvailableOrder}
                sx={{ alignSelf: 'flex-end', mt: 0, mb: 2 }}>
                Use next available order ({getNextAvailableOrder()})
              </Button>
            )}
          </Box>
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
