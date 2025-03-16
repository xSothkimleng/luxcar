'use client';
import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Grid, Typography, Skeleton, Alert } from '@mui/material';
import { useCars } from '@/hooks/useCar';
import { useMemo } from 'react';

const PopularCar = () => {
  const { data: cars, isLoading, isError } = useCars();

  // Get 12 most recent cars sorted alphabetically by name
  const recentAlphabeticalCars = useMemo(() => {
    if (!cars) return [];

    // Create a copy to avoid mutating the original data
    return (
      [...cars]
        // First sort by createdAt in descending order (newest first)
        .sort((a, b) => {
          // Handle cases where createdAt might be undefined
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        // Take the 12 most recent cars
        .slice(0, 12)
        // Then sort these 12 cars alphabetically by name
        .sort((a, b) => {
          // Handle cases where name might be undefined
          if (!a.name) return 1;
          if (!b.name) return -1;
          return a.name.localeCompare(b.name);
        })
    );
  }, [cars]);

  return (
    <Box sx={{ py: 2, px: 2, bgcolor: '#f2f2f2' }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Popular Models
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Our latest additions to the inventory
        </Typography>
      </Box>

      {isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {isError}
        </Alert>
      )}

      <Grid container spacing={1}>
        {isLoading ? (
          // Skeleton loading state - show 12 placeholders
          Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={`skeleton-${index}`} sx={{ height: '300px' }}>
              <Skeleton variant='rectangular' animation='wave' width='100%' height='100%' sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : recentAlphabeticalCars && recentAlphabeticalCars.length > 0 ? (
          // Display recent cars sorted alphabetically
          recentAlphabeticalCars.map(car => (
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
