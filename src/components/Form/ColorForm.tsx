'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar, TextField } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import { Color } from '@/types/color';
import { useCreateColor, useUpdateColor } from '@/hooks/useColor';

interface ColorFormProps {
  color?: Color; // Optional color for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for success
}

const ColorForm = ({ color, isEdit = false, onClose, onSuccess }: ColorFormProps) => {
  // Form state
  const [name, setName] = useState('');
  const [rgb, setRgb] = useState('#000000');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks for creating and updating
  const { mutateAsync: createColor, isPending: isCreating } = useCreateColor();
  const { mutateAsync: updateColor, isPending: isUpdating } = useUpdateColor();

  // Determine if form is currently submitting
  const isSubmitting = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (isEdit && color) {
      setName(color.name);
      setRgb(color.rgb);
    }
  }, [isEdit, color]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setError('Color name is required');
      return;
    }

    if (!rgb.trim()) {
      setError('RGB value is required');
      return;
    }

    try {
      if (isEdit && color) {
        // Update existing color
        await updateColor({
          id: color.id,
          name,
          rgb,
        });
        setSuccessMessage('Color updated successfully!');
      } else {
        // Create new color
        await createColor({ name, rgb });
        setSuccessMessage('Color created successfully!');
      }

      // If success callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }

      // Clear form after success for new color (optional)
      if (!isEdit) {
        setName('');
        setRgb('#000000');
      }

      onClose();
    } catch (err) {
      console.error('Error saving color:', err);
      setError(err instanceof Error ? err.message : 'Failed to save color');
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
            label='Color Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? 'Color name is required' : ''}
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label='RGB Color'
              type='color'
              value={rgb}
              onChange={e => setRgb(e.target.value)}
              required
              disabled={isSubmitting}
              sx={{
                width: '100px',
                '& input': {
                  height: '40px',
                  cursor: 'pointer',
                },
              }}
            />
            <TextField
              label='RGB Value'
              value={rgb}
              onChange={e => setRgb(e.target.value)}
              fullWidth
              required
              disabled={isSubmitting}
              placeholder='#FFFFFF'
              helperText='Hex code (e.g. #FF0000 for red)'
              inputProps={{
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              }}
            />
          </Box>
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
          disabled={isSubmitting || !name.trim() || !rgb.trim()}
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
            'Update Color'
          ) : (
            'Create Color'
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

export default ColorForm;
