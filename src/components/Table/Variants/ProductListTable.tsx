import * as React from 'react';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
  DialogActions,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GridTable from '@/components/Table';
import CarDetail from '@/components/CarDetail';
import { Car } from '@/types/car';
import { useCars, useDeleteCar } from '@/hooks/useCar';
import CarEditForm from '@/components/Form/CarEditForm';

const ProductListTable = () => {
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [openEditCarDialog, setOpenEditCarDialog] = useState(false);
  const [openDeleteCarDialog, setOpenDeleteCarDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const { data: cars, isLoading } = useCars();
  const { mutateAsync: deleteCarMutation, isPending: isDeleting } = useDeleteCar();
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenCarDialog(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setOpenEditCarDialog(true);
  };

  const handleOpenDeleteDialog = (car: Car) => {
    setSelectedCar(car);
    setOpenDeleteCarDialog(true);
  };

  const handleDeleteCar = async () => {
    if (!selectedCar) return;

    try {
      setOpenDeleteCarDialog(false);
      // Set the deleting car ID to show loading state in UI
      setDeletingCarId(selectedCar.id);

      // Use the hook to delete the car
      await deleteCarMutation(selectedCar.id);

      // Show success message
      setSnackbarSeverity('success');
      setSnackbarMessage('Toy car deleted successfully!');
    } catch (error) {
      console.error('Error deleting car:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to delete toy car. Please try again.');
    } finally {
      // Clear the deleting car ID
      setDeletingCarId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        renderCell: params => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={params.row.thumbnailImage.url}
              alt={params.row.name}
              sx={{ width: 40, height: 40, borderRadius: '8px' }}
            />
            <p style={{ color: '#2D3748', fontWeight: 'bold' }}>{params.value}</p>
          </Box>
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 1,
        renderCell: params => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ color: '#605BFF', fontWeight: 'bold' }}>{params.value}</p>
          </Box>
        ),
      },
      {
        field: 'brand',
        headerName: 'Brand',
        flex: 0.7,
        renderCell: params => (
          <Chip
            label={params.value.name}
            size='small'
            sx={{
              backgroundColor: 'rgba(96, 91, 255, 0.1)',
              color: '#605BFF',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        ),
      },
      {
        field: 'color',
        headerName: 'Color',
        flex: 0.8,
        renderCell: params => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '4px',
                  backgroundColor: params.value.rgb,
                }}
              />
              <p>{params.value.name}</p>
            </Box>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Date Added',
        flex: 1,
        renderCell: params => <p>{formatDate(params.value)}</p>,
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1.2,
        renderCell: params => {
          const car = cars?.find(c => c.id === params.row.id);
          if (!car) return null;

          return (
            <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
              <Tooltip title='View Details' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleViewCar(car)}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(96, 91, 255, 0.1)',
                    color: '#605BFF',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(96, 91, 255, 0.2)',
                      boxShadow: '0 4px 10px rgba(96, 91, 255, 0.2)',
                    },
                  }}>
                  <VisibilityOutlinedIcon fontSize='small' />
                </Button>
              </Tooltip>

              <Tooltip title='Edit' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleEditCar(car)}
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
                  onClick={() => handleOpenDeleteDialog(car)}
                  disabled={deletingCarId === car.id}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: deletingCarId === car.id ? 'rgba(231, 76, 60, 0.05)' : 'rgba(231, 76, 60, 0.1)',
                    color: deletingCarId === car.id ? 'rgba(231, 76, 60, 0.5)' : '#e74c3c',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(231, 76, 60, 0.2)',
                      boxShadow: '0 4px 10px rgba(231, 76, 60, 0.2)',
                    },
                  }}>
                  {deletingCarId === car.id ? (
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
    [cars, deletingCarId],
  );

  return (
    <>
      <GridTable
        rows={cars || []}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'dateAdded', sort: 'desc' }] },
        }}
      />

      {/* View Car Dialog */}
      <Dialog
        fullWidth
        maxWidth='lg'
        open={openCarDialog}
        onClose={() => setOpenCarDialog(false)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#2D3748' }}>
              Toy Car Details
            </Typography>
            <IconButton onClick={() => setOpenCarDialog(false)} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCar ? (
            <CarDetail car={selectedCar} onBack={() => setOpenCarDialog(false)} />
          ) : (
            <Typography sx={{ p: 3 }}>No car selected.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog
        fullWidth
        maxWidth='lg'
        open={openEditCarDialog}
        onClose={() => setOpenEditCarDialog(false)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#2D3748' }}>
              Edit Car Details
            </Typography>
            <IconButton onClick={() => setOpenEditCarDialog(false)} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCar ? (
            <CarEditForm car={selectedCar} onClose={() => setOpenEditCarDialog(false)} />
          ) : (
            <Typography sx={{ p: 3 }}>No car selected.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteCarDialog}
        onClose={() => setOpenDeleteCarDialog(false)}
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
              Delete Toy Car
            </Typography>
            <IconButton onClick={() => setOpenDeleteCarDialog(false)} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete the following car?
          </Typography>
          {selectedCar && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
              }}>
              <Avatar
                variant='rounded'
                src='/assets/images/sampleCar.jpg'
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '8px',
                }}
              />
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  {selectedCar.name}
                </Typography>
              </Box>
            </Box>
          )}
          <Typography variant='body2' color='error' sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteCarDialog(false)} variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCar}
            variant='contained'
            color='error'
            disabled={isDeleting}
            sx={{
              minWidth: '100px',
            }}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default ProductListTable;
