'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Typography,
  Container,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CarDetail from '@/components/CarDetail';
import CloseIcon from '@mui/icons-material/Close';
import { Car } from '@/types/car';
import FilterDrawer from '@/components/LandingPage/FilterDrawer';
import CarCard from '../../CarCard';
import { useCars } from '@/hooks/useCar';

const ShopCollectionPage = () => {
  const { data: cars } = useCars();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenCarDialog(true);
  };

  useEffect(() => {
    if (cars) {
      setFilteredCars(cars);
    }
  }, [cars]);

  return (
    <Container maxWidth='xl' sx={{ py: 4, position: 'relative' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom component='div'>
          Our Collection
        </Typography>
        <Typography variant='body1' color='text.secondary' gutterBottom>
          Browse all our available cars
        </Typography>
      </Box>

      {/* Main Content - Filters and Products */}
      <Grid container spacing={3}>
        {/* Left Sidebar - Filters - Only on desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3} lg={2.5}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                position: 'sticky',
                top: '80px',
                borderRadius: 2,
              }}>
              <FilterDrawer cars={cars || []} setFilteredCars={setFilteredCars} />
            </Paper>
          </Grid>
        )}

        {/* Right Side - Product List - Full width on mobile */}
        <Grid item xs={12} md={9} lg={9.5}>
          {filteredCars.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'rgba(0,0,0,0.03)',
                borderRadius: 2,
              }}>
              <Typography variant='h6' color='text.secondary' component='div'>
                No cars found matching your criteria
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredCars.map(car => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <CarCard car={car} handleViewCar={handleViewCar} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer - Only on mobile */}
      {isMobile && (
        <Box>
          <FilterDrawer cars={cars || []} setFilteredCars={setFilteredCars} />
        </Box>
      )}

      {/* Car Detail Dialog */}
      <Dialog fullWidth maxWidth='xl' open={openCarDialog} onClose={() => setOpenCarDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setOpenCarDialog(false)}
            sx={{
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCar ? (
            <CarDetail car={selectedCar} onBack={() => setOpenCarDialog(false)} />
          ) : (
            <Typography p={4}>No car selected.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShopCollectionPage;
