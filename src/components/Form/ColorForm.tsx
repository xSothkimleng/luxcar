'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar, TextField } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import { Color } from '@/types/color';
import { useCreateColor, useUpdateColor, useColors } from '@/hooks/useColor';

interface ColorFormProps {
  color?: Color;
  isEdit?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ColorForm = ({ color, isEdit = false, onClose, onSuccess }: ColorFormProps) => {
  // Form state
  const [name, setName] = useState('');
  const [rgb, setRgb] = useState('#000000');
  const [orderSequence, setOrderSequence] = useState<number>(0);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch all colors for validation
  const { data: colors = [] } = useColors();

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
      setOrderSequence(color.order || 0);
    }
  }, [isEdit, color]);

  // Validate order sequence whenever it changes or when colors are loaded
  useEffect(() => {
    validateOrderSequence(orderSequence);
  }, [orderSequence, colors]);

  // Find the next available order number
  const getNextAvailableOrder = () => {
    if (colors.length === 0) return 1;

    // Get all order numbers
    const orderNumbers = colors
      .map(c => c.order)
      .filter((order): order is number => order !== null && order !== undefined)
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

  // Function to validate if the order sequence is unique
  const validateOrderSequence = (order: number) => {
    // Clear previous order error
    setOrderError(null);

    // Skip validation if we're editing and the order hasn't changed
    if (isEdit && color && order === color.order) {
      return true;
    }

    // Check if any existing color has the same order
    const existingColorWithSameOrder = colors.find(c => c.order === order && (!isEdit || c.id !== color?.id));

    if (existingColorWithSameOrder) {
      setOrderError(`Order ${order} is already assigned to "${existingColorWithSameOrder.name}"`);
      return false;
    }

    return true;
  };

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

    // Validate order sequence one more time before submitting
    if (!validateOrderSequence(orderSequence)) {
      setError('Please fix the order sequence issue');
      return;
    }

    try {
      if (isEdit && color) {
        // Update existing color
        await updateColor({
          id: color.id,
          name,
          order: orderSequence,
          rgb,
        });
        setSuccessMessage('Color updated successfully!');
      } else {
        // Create new color
        await createColor({ name, rgb, order: orderSequence });
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
        setOrderSequence(0);
      }

      onClose();
    } catch (err) {
      console.error('Error saving color:', err);
      setError(err instanceof Error ? err.message : 'Failed to save color');
    }
  };

  // Handle using suggested order
  const handleUseNextAvailableOrder = () => {
    const nextOrder = getNextAvailableOrder();
    setOrderSequence(nextOrder);
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
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CoolButton
              label='Order Sequence'
              value={orderSequence}
              onChange={e => setOrderSequence(Number(e.target.value))}
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
          disabled={isSubmitting || !name.trim() || !rgb.trim() || !!orderError}
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
