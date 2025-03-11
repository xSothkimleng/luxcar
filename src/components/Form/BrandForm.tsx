'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import { Brand } from '@/types/brand';
import { useCreateBrand, useUpdateBrand } from '@/hooks/useBrand';

interface BrandFormProps {
  brand?: Brand; // Optional brand for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for success
}

const BrandForm = ({ brand, isEdit = false, onClose, onSuccess }: BrandFormProps) => {
  // Form state
  const [name, setName] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks for creating and updating
  const { mutateAsync: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutateAsync: updateBrand, isPending: isUpdating } = useUpdateBrand();

  // Determine if form is currently submitting
  const isSubmitting = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (isEdit && brand) {
      setName(brand.name);
    }
  }, [isEdit, brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setError('Brand name is required');
      return;
    }

    try {
      if (isEdit && brand) {
        // Update existing brand
        await updateBrand({
          id: brand.id,
          name,
        });
        setSuccessMessage('Brand updated successfully!');
      } else {
        // Create new brand
        await createBrand({ name });
        setSuccessMessage('Brand created successfully!');
      }

      // If success callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }

      // Clear form after success for new brand (optional)
      if (!isEdit) {
        setName('');
      }

      onClose();
    } catch (err) {
      console.error('Error saving brand:', err);
      setError(err instanceof Error ? err.message : 'Failed to save brand');
    }
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
            label='Brand Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? 'Brand name is required' : ''}
            disabled={isSubmitting}
          />
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
            'Update Brand'
          ) : (
            'Create Brand'
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

export default BrandForm;
