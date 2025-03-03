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

// Define the Car type with enhanced properties

// Create dummy car data with enhanced properties
const dummyCars: Car[] = [
  {
    id: '1',
    name: 'McLaren 720S GT3 Evo',
    price: 89.99,
    color: 'Red',
    brand: 'MiniGT',
    status: 'In Stock',
    dateAdded: '2024-02-15',
    description:
      '<p>The <strong>McLaren 720S GT3 Evo</strong> is a highly detailed 1:64 scale diecast model featuring opening doors and authentic livery. This premium collectible represents the Pfaff Motorsports 2024 IMSA Daytona 24 Hours race car.</p><p>This model includes:</p><ul><li>Die-cast metal body with plastic parts</li><li>Rubber tires</li><li>Detailed interior</li><li>Authentic race graphics</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '2',
    name: 'Nissan Skyline GT-R (R33)',
    price: 62.99,
    color: 'Blue',
    brand: 'MiniGT',
    status: 'Low Stock',
    dateAdded: '2024-01-28',
    description:
      '<p>The <strong>Nissan Skyline GT-R (R33)</strong> Imai Racing V1 is a premium collectible diecast model that captures the iconic Japanese sports car in exquisite detail. This limited edition piece features authentic racing livery and fine detailing.</p><p>Key features:</p><ul><li>Metal body with plastic components</li><li>Realistic wheels and tires</li><li>Special edition packaging</li><li>Accurate paint finish</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '3',
    name: 'Honda NSX (NA1) Kaido WORKS',
    price: 65.49,
    color: 'Black',
    brand: 'Tarmac Works',
    status: 'In Stock',
    dateAdded: '2024-02-10',
    description:
      '<p>The <strong>Honda NSX (NA1) Kaido WORKS V2</strong> is a premium 1:43 scale model that represents the legendary Japanese supercar. This highly detailed collectible features the distinctive Kaido Works styling and modifications.</p><p>Highlights include:</p><ul><li>Detailed body kit and aerodynamics</li><li>Custom wheels and stance</li><li>High-quality paint finish</li><li>Display-ready presentation</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '4',
    name: 'Chevrolet Silverado "Sumatran Rhino"',
    price: 89.99,
    color: 'Silver',
    brand: 'KAIDO x MIZU',
    status: 'Out of Stock',
    dateAdded: '2024-01-05',
    description:
      '<p>The <strong>Chevrolet Silverado "Sumatran Rhino"</strong> is a special collaboration piece between KAIDO and MIZU Diecast. This 1:24 scale model features extensive detailing and a unique livery inspired by the endangered Sumatran Rhino.</p><p>Features include:</p><ul><li>Larger 1:24 scale for impressive display</li><li>Opening doors, hood and tailgate</li><li>Detailed suspension and undercarriage</li><li>Limited edition collector packaging</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '5',
    name: 'Toyota Supra A90 Liberty Walk',
    price: 72.99,
    color: 'White',
    brand: 'MiniGT',
    status: 'In Stock',
    dateAdded: '2024-02-20',
    description:
      '<p>The <strong>Toyota Supra A90 Liberty Walk</strong> is a premium 1:64 scale diecast model featuring the aggressive Liberty Walk body kit and styling. This highly detailed collectible captures the essence of modern Japanese tuner culture.</p><p>Key specifications:</p><ul><li>Die-cast metal construction</li><li>Widebody kit detailing</li><li>Authentic Liberty Walk graphics</li><li>Custom wheels and lowered stance</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
];

const ProductListTable = () => {
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);

  // Simulate loading data
  useMemo(() => {
    const timer = setTimeout(() => {
      setCars(dummyCars);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenCarDialog(true);
  };

  const handleDeleteCar = (id: string) => {
    // Simulate deletion by filtering out the car
    setCars(prev => prev.filter(car => car.id !== id));
    setSnackbarSeverity('success');
    setSnackbarMessage('Toy car deleted successfully!');
  };

  const getStatusChip = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';
    let backgroundColor = '';
    let textColor = '';

    switch (status) {
      case 'In Stock':
        color = 'success';
        backgroundColor = 'rgba(46, 204, 113, 0.1)';
        textColor = '#2ecc71';
        break;
      case 'Low Stock':
        color = 'warning';
        backgroundColor = 'rgba(241, 196, 15, 0.1)';
        textColor = '#f39c12';
        break;
      case 'Out of Stock':
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        color = 'error';
        backgroundColor = 'rgba(231, 76, 60, 0.1)';
        textColor = '#e74c3c';
        break;
      default:
        backgroundColor = 'rgba(0, 0, 0, 0.1)';
        textColor = '#7f8c8d';
    }

    return (
      <Chip
        label={status}
        size='small'
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          fontWeight: 600,
          fontSize: '0.75rem',
          borderRadius: '4px',
          height: '24px',
        }}
      />
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Car Model',
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
            <p style={{ color: '#605BFF', fontWeight: 'bold' }}>{formatPrice(params.value)}</p>
          </Box>
        ),
      },
      {
        field: 'brand',
        headerName: 'Brand',
        flex: 0.7,
        renderCell: params => (
          <Chip
            label={params.value}
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
          const colorMap: Record<string, string> = {
            Red: '#e74c3c',
            Blue: '#3498db',
            Black: '#2c3e50',
            Silver: '#7f8c8d',
            White: '#ecf0f1',
          };

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '4px',
                  backgroundColor: colorMap[params.value] || params.value,
                  border: params.value === 'White' ? '1px solid #ddd' : 'none',
                }}
              />
              <p>{params.value}</p>
            </Box>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: params => getStatusChip(params.value),
      },
      {
        field: 'dateAdded',
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
                  const car = cars.find(c => c.id === params.row.id);
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
        rows={cars}
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
        <DialogTitle sx={{ bgcolor: '#F8FAFC', borderBottom: '1px solid #EDF2F7', py: 2 }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#2D3748' }}>
              Toy Car Details
            </Typography>
            <IconButton onClick={() => setOpenCarDialog(false)} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
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
