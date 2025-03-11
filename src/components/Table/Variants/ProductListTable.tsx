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
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GridTable from '@/components/Table';
import CarDetail from '@/components/CarDetail';
import { Car } from '@/types/car';
import { useCars } from '@/hooks/useCar';

const ProductListTable = () => {
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const { data: cars, isLoading } = useCars();

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenCarDialog(true);
  };

  const handleDeleteCar = (id: string) => {
    console.log('Deleting car with id:', id);
    setSnackbarSeverity('success');
    setSnackbarMessage('Toy car deleted successfully!');
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
              variant='rounded'
              src='/assets/images/sampleCar.jpg'
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
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
        renderCell: params => (
          <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
            <Tooltip title='View Details' arrow>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  const car = cars?.find(c => c.id === params.row.id);
                  if (car) handleViewCar(car);
                }}
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
                onClick={() => handleDeleteCar(params.row.id)}
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
                <DeleteOutlineIcon fontSize='small' />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [cars],
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
