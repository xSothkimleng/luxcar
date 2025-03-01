import GridTable from '@/components/Table';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CarDetail from '@/components/CarDetail';

// Define the Car type
interface Car {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  images: string[];
}

// Create dummy car data
const dummyCars: Car[] = [
  {
    id: '1',
    name: 'Tesla Model S',
    price: 89999.99,
    color: 'Red',
    description:
      '<p>The <strong>Tesla Model S</strong> is an all-electric five-door liftback sedan produced by Tesla, Inc. The Model S features a dual-motor all-wheel drive setup and can accelerate from 0-60 mph in just 2.3 seconds.</p><p>This model includes:</p><ul><li>Autopilot functionality</li><li>17-inch touchscreen display</li><li>Wireless charging</li><li>Premium audio system</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '2',
    name: 'BMW 5 Series',
    price: 62999.99,
    color: 'Blue',
    description:
      '<p>The <strong>BMW 5 Series</strong> is a luxury sedan that combines elegant styling with advanced technology and driving dynamics. This car offers a perfect balance of comfort, performance, and efficiency.</p><p>Key features:</p><ul><li>10.25-inch touchscreen infotainment system</li><li>Leather upholstery</li><li>Ambient interior lighting</li><li>Advanced driver assistance systems</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '3',
    name: 'Mercedes-Benz E-Class',
    price: 65499.99,
    color: 'Black',
    description:
      '<p>The <strong>Mercedes-Benz E-Class</strong> represents the pinnacle of luxury and refinement in the mid-size sedan segment. With its elegant design and cutting-edge technology, it delivers an exceptional driving experience.</p><p>Highlights include:</p><ul><li>MBUX infotainment system</li><li>Premium Burmester sound system</li><li>64-color ambient lighting</li><li>Air Body Control suspension</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '4',
    name: 'Audi A6',
    price: 58999.99,
    color: 'Silver',
    description:
      '<p>The <strong>Audi A6</strong> is a sophisticated executive sedan with cutting-edge technology and a refined interior. The car offers a smooth ride with powerful performance options.</p><p>Features include:</p><ul><li>Dual touchscreen MMI system</li><li>Virtual Cockpit Plus</li><li>Bang & Olufsen 3D Premium Sound System</li><li>Quattro all-wheel drive</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
  {
    id: '5',
    name: 'Toyota Camry Hybrid',
    price: 32999.99,
    color: 'White',
    description:
      '<p>The <strong>Toyota Camry Hybrid</strong> combines efficiency and reliability with a comfortable ride. This fuel-efficient sedan is perfect for daily commuting while reducing your carbon footprint.</p><p>Key specifications:</p><ul><li>2.5L 4-cylinder hybrid engine</li><li>8-inch touchscreen</li><li>Apple CarPlay and Android Auto</li><li>Toyota Safety Sense 2.5+</li></ul>',
    images: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg', '/assets/images/sampleCar.jpg'],
  },
];

const CarTable = () => {
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
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
    setSnackbarMessage('Car deleted successfully!');
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Car Name',
        flex: 2,
        renderCell: params => <Typography fontWeight='medium'>{params.value}</Typography>,
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 1,
        renderCell: params => (
          <Typography fontWeight='medium'>
            ${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        ),
      },
      {
        field: 'color',
        headerName: 'Color',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => (
          <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
            <Button
              variant='contained'
              color='info'
              size='small'
              onClick={() => {
                const car = cars.find(c => c.id === params.row.id);
                if (car) handleViewCar(car);
              }}>
              <VisibilityIcon />
            </Button>
            <Button variant='contained' color='error' size='small' onClick={() => handleDeleteCar(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Box>
        ),
      },
    ],
    [cars],
  );

  return (
    <>
      <Box mb={3}>
        <Typography variant='h4' fontWeight='bold'>
          Car Inventory
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your vehicle listings
        </Typography>
      </Box>

      <GridTable
        rows={cars}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
        }}
      />

      <Dialog fullWidth maxWidth='lg' open={openCarDialog} onClose={() => setOpenCarDialog(false)}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>Car Details</Typography>
            <IconButton onClick={() => setOpenCarDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCar ? (
            <CarDetail car={selectedCar} onBack={() => setOpenCarDialog(false)} />
          ) : (
            <Typography>No car selected.</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbarMessage?.includes('success') ? 'success' : 'error'} onClose={() => setSnackbarMessage(null)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CarTable;
