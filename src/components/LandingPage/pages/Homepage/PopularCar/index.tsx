'use client';

import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Grid, Typography, Skeleton, Alert } from '@mui/material';
import { useCars } from '@/hooks/useCar';

const PopularCar = () => {
  const { data: cars, isLoading, isError } = useCars();

  return (
    <Box sx={{ py: 6, px: 6, bgcolor: '#f2f2f2' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Popular Models
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Most popular cars in our inventory
        </Typography>
      </Box>

      {isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {isError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {isLoading ? (
          // Skeleton loading state
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ height: '300px' }}>
              <Skeleton variant='rectangular' animation='wave' width='100%' height='100%' sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : cars && cars.length > 0 ? (
          // Display cars from API
          cars.map(car => (
            <Grid item xs={12} sm={6} md={3} key={car.id} sx={{ height: '300px' }}>
              <CarThumbnail car={car} />
            </Grid>
          ))
        ) : (
          // No cars found state
          <Grid item xs={12}>
            <Alert severity='info'>No cars found in the inventory.</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PopularCar;
