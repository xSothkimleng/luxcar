'use client';
import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Grid, Typography, Skeleton, Alert } from '@mui/material';
import { useCars } from '@/hooks/useCar';
import { useMemo } from 'react';

const PopularCar = () => {
  const { data: cars, isLoading, isError } = useCars();

  const randomAlphabeticalCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];

    // Filter out Tomica brand cars first
    const nonTomicaCars = cars.filter(car => car.brand?.name?.toLowerCase() !== 'tomica');

    // Create a copy to avoid mutating the original data
    const carsCopy = [...nonTomicaCars];

    // Fisher-Yates (Knuth) Shuffle algorithm to randomize the array
    for (let i = carsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [carsCopy[i], carsCopy[j]] = [carsCopy[j], carsCopy[i]];
    }

    // Take the first 12 cars (or all if less than 12)
    const randomizedCars = carsCopy.slice(0, 12);

    // Sort these 12 random cars alphabetically by name
    return randomizedCars.sort((a, b) => {
      // Handle cases where name might be undefined
      if (!a.name) return 1;
      if (!b.name) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [cars]);

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
          Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`} sx={{ height: '300px' }}>
              <Skeleton variant='rectangular' animation='wave' width='100%' height='100%' sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : randomAlphabeticalCars && randomAlphabeticalCars.length > 0 ? (
          randomAlphabeticalCars.map(car => (
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
