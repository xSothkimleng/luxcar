import CarThumbnail from '@/components/LandingPage/CarThumbnail';
import { Box, Grid, Typography } from '@mui/material';
import { dummyCars } from '@/data/cars';

const PopularCar = () => {
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
      <Grid container spacing={2}>
        {dummyCars.map(car => (
          <Grid item xs={12} sm={6} md={3} key={car.id} sx={{ height: '300px' }}>
            <CarThumbnail car={car} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularCar;
