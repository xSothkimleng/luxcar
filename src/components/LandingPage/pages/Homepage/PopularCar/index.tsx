'use client';
import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Grid, Typography, Skeleton, Alert } from '@mui/material';
import { usePopularCars } from '@/hooks/useCar';
import { useQueryClient } from '@tanstack/react-query';
import { Car } from '@/types/car';
import { useEffect } from 'react';

interface PopularCarProps {
  initialData?: Car[];
}

const PopularCar = ({ initialData }: PopularCarProps) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (initialData) {
      queryClient.setQueryData(['popularCars'], initialData);
    }
  }, [initialData, queryClient]);
  const { data: cars, isLoading, isError } = usePopularCars();

  return (
    <Box sx={{ py: 2, px: 2, bgcolor: '#f2f2f2' }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Popular Models
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          &quot;High-Speed Fun Starts Here!&quot;
        </Typography>
      </Box>

      {isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {isError}
        </Alert>
      )}

      <Grid container spacing={1}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`} sx={{ height: '300px' }}>
              <Skeleton variant='rectangular' animation='wave' width='100%' height='100%' sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : cars && cars.length > 0 ? (
          cars.map(car => (
            <Grid item xs={12} sm={6} md={4} key={car.id} sx={{ height: '300px' }}>
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
