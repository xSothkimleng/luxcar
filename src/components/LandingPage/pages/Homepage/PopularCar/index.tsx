'use client';
import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Typography, Skeleton, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useHomepageCars } from '@/hooks/useHomepageCars';
import { Car } from '@/types/car';
import { Key } from 'react';

const PopularCar = () => {
  const { data: homepageCars, isLoading, isError } = useHomepageCars();

  return (
    <Box sx={{ py: 2, px: 2, bgcolor: '#f2f2f2' }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Featured Models
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

      <Grid container spacing={0.5}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${index}`} sx={{ height: '300px' }}>
              <Skeleton variant='rectangular' animation='wave' width='100%' height='100%' sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : homepageCars && homepageCars.length > 0 ? (
          homepageCars.map((item: { id: Key | null | undefined; car: Car }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} sx={{ height: '300px' }}>
              <CarThumbnail car={item.car} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Alert severity='info'>No featured cars found. Add some in the dashboard.</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PopularCar;
