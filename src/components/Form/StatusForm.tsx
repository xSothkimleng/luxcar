'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Button, Box, Alert, CircularProgress, Snackbar } from '@mui/material';
import CoolButton from '@/components/CustomButton';
import { Status } from '@/types/status';
import { useCreateStatus, useUpdateStatus } from '@/hooks/useStatus';

interface StatusFormProps {
  status?: Status; // Optional status for editing
  isEdit?: boolean; // Flag to determine if it's edit mode
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for success
}

const StatusForm = ({ status, isEdit = false, onClose, onSuccess }: StatusFormProps) => {
  // Form state
  const [name, setName] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks for creating and updating
  const { mutateAsync: createStatus, isPending: isCreating } = useCreateStatus();
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateStatus();

  // Determine if form is currently submitting
  const isSubmitting = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (isEdit && status) {
      setName(status.name);
    }
  }, [isEdit, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setError('Status name is required');
      return;
    }

    try {
      if (isEdit && status) {
        // Update existing status
        await updateStatus({
          id: status.id,
          name,
        });
        setSuccessMessage('Status updated successfully!');
      } else {
        // Create new status
        await createStatus({ name });
        setSuccessMessage('Status created successfully!');
      }

      // If success callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }

      // Clear form after success for new status (optional)
      if (!isEdit) {
        setName('');
      }

      onClose();
    } catch (err) {
      console.error('Error saving status:', err);
      setError(err instanceof Error ? err.message : 'Failed to save status');
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
            label='Status Name'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant='filled'
            type='text'
            className='mb-4'
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? 'Status name is required' : ''}
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
            'Update Status'
          ) : (
            'Create Status'
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

export default StatusForm;
