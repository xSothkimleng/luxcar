import * as React from 'react';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GridTable from '@/components/Table';
import { useModels, useDeleteModel } from '@/hooks/useModel';
import { Model } from '@/types/model';
import ModelForm from '@/components/Form/ModelForm';

const ModelListTable = () => {
  // UI States
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Data Fetching & Mutations
  const { data: models, isLoading } = useModels();
  const { mutateAsync: deleteModel, isPending: isDeleting } = useDeleteModel();

  // Delete Handling
  const handleOpenDeleteDialog = (model: Model) => {
    setSelectedModel(model);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedModel(null);
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;

    try {
      await deleteModel(selectedModel.id);
      setSnackbarSeverity('success');
      setSnackbarMessage('Model deleted successfully!');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting model:', error);

      // Check if this is a constraint violation error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.data?.error === 'Cannot delete model because it has associated cars') {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Cannot delete model "${selectedModel.name}" because it's used by existing cars.`);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to delete model. Please try again.');
      }
      handleCloseDeleteDialog();
    }
  };

  // Edit Handling
  const handleOpenEditDialog = (model: Model) => {
    setSelectedModel(model);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedModel(null);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        renderCell: params => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <p style={{ color: '#2D3748', fontWeight: 'bold' }}>{params.value}</p>
          </Box>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => {
          const model = models?.find(m => m.id === params.row.id);
          if (!model) return null;

          return (
            <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
              <Tooltip title='Edit' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenEditDialog(model)}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(38, 198, 249, 0.1)',
                    color: '#26c6f9',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(38, 198, 249, 0.2)',
                      boxShadow: '0 4px 10px rgba(38, 198, 249, 0.2)',
                    },
                  }}>
                  <EditOutlinedIcon fontSize='small' />
                </Button>
              </Tooltip>
              <Tooltip title='Delete' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenDeleteDialog(model)}
                  disabled={isDeleting && selectedModel?.id === model.id}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(231, 76, 60, 0.1)',
                    color: '#e74c3c',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(231, 76, 60, 0.2)',
                      boxShadow: '0 4px 10px rgba(231, 76, 60, 0.2)',
                    },
                  }}>
                  {isDeleting && selectedModel?.id === model.id ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <DeleteOutlineIcon fontSize='small' />
                  )}
                </Button>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [models, isDeleting, selectedModel],
  );

  return (
    <>
      <GridTable
        rows={models || []}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}>
        <DialogTitle
          sx={{
            py: 2,
            px: 3,
          }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Edit Model
            </Typography>
            <IconButton
              onClick={handleCloseEditDialog}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          {selectedModel && (
            <ModelForm
              model={selectedModel}
              isEdit={true}
              onClose={handleCloseEditDialog}
              onSuccess={() => {
                setSnackbarSeverity('success');
                setSnackbarMessage('Model updated successfully!');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
          },
        }}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#2D3748' }}>
              Delete Model
            </Typography>
            <IconButton onClick={handleCloseDeleteDialog} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete the following model?
          </Typography>
          {selectedModel && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {selectedModel.name}
              </Typography>
            </Box>
          )}
          <Alert severity='warning' sx={{ mt: 3 }}>
            This action cannot be undone. Any cars associated with this model may be affected.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteModel}
            variant='contained'
            color='error'
            disabled={isDeleting}
            sx={{
              borderRadius: '8px',
              minWidth: '100px',
            }}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Zoom}>
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarMessage(null)}
          sx={{
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            fontWeight: 500,
          }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelListTable;
