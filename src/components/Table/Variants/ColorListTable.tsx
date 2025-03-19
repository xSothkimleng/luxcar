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
import { useColors, useDeleteColor } from '@/hooks/useColor';
import { Color } from '@/types/color';
import ColorForm from '@/components/Form/ColorForm';

const ColorListTable = () => {
  // UI States
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  // Data Fetching & Mutations
  const { data: colors, isLoading } = useColors();
  const { mutateAsync: deleteColor, isPending: isDeleting } = useDeleteColor();

  // Delete Handling
  const handleOpenDeleteDialog = (color: Color) => {
    setSelectedColor(color);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedColor(null);
  };

  const handleDeleteColor = async () => {
    if (!selectedColor) return;

    try {
      await deleteColor(selectedColor.id);
      setSnackbarSeverity('success');
      setSnackbarMessage('Color deleted successfully!');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting color:', error);

      // Check if this is a constraint violation error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (error && (error as any).response?.data?.error === 'Cannot delete color because it has associated cars') {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Cannot delete color "${selectedColor.name}" because it's used by existing cars.`);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to delete color. Please try again.');
      }
      handleCloseDeleteDialog();
    }
  };

  // Edit Handling
  const handleOpenEditDialog = (color: Color) => {
    setSelectedColor(color);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedColor(null);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: params => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <p style={{ color: '#2D3748', fontWeight: 'bold' }}>{params.value}</p>
          </Box>
        ),
      },
      {
        field: 'order',
        headerName: 'Order Sequence',
        flex: 1,
        renderCell: params => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <p>{params.value === 0 || params.value === null ? 'UNSET' : params.value}</p>
          </Box>
        ),
      },
      {
        field: 'rgb',
        headerName: 'Color',
        flex: 1,
        renderCell: params => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: params.value,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
            <Typography>{params.value}</Typography>
          </Box>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => {
          const color = colors?.find(c => c.id === params.row.id);
          if (!color) return null;

          return (
            <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
              <Tooltip title='Edit' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenEditDialog(color)}
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
                  onClick={() => handleOpenDeleteDialog(color)}
                  disabled={isDeleting && selectedColor?.id === color.id}
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
                  {isDeleting && selectedColor?.id === color.id ? (
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
    [colors, isDeleting, selectedColor],
  );

  return (
    <>
      <GridTable
        rows={colors || []}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'order', sort: 'asc' }] },
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
              Edit Color
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
          {selectedColor && (
            <ColorForm
              color={selectedColor}
              isEdit={true}
              onClose={handleCloseEditDialog}
              onSuccess={() => {
                setSnackbarSeverity('success');
                setSnackbarMessage('Color updated successfully!');
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
              Delete Color
            </Typography>
            <IconButton onClick={handleCloseDeleteDialog} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete the following color?
          </Typography>
          {selectedColor && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  backgroundColor: selectedColor.rgb,
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              />
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  {selectedColor.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {selectedColor.rgb}
                </Typography>
              </Box>
            </Box>
          )}
          <Alert severity='warning' sx={{ mt: 3 }}>
            This action cannot be undone. Any cars associated with this color may be affected.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteColor}
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

export default ColorListTable;
