'use client';
import SwiperSlideCarShowCase from '@/components/LandingPage/SwiperSlide';
import MessageBanner from '../../MessageBanner';
import { Box, Button, Typography } from '@mui/material';
import PopularCar from './PopularCar';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Promotional Banner */}
      <MessageBanner />
      {/* Carousel */}
      <Box sx={{ mt: 0 }}>
        <SwiperSlideCarShowCase />
      </Box>
      <Box sx={{ width: '100%', bgcolor: '#f5f5f5', height: '100%' }}>
        <PopularCar />
      </Box>
      <Box sx={{ pb: 6 }}>
        <Typography variant='h4' fontWeight='bold' sx={{ textAlign: 'center' }}>
          <Button variant='contained' sx={{ background: '#D32F2F' }} onClick={() => router.push('/shop')}>
            Explore More
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Homepage;
