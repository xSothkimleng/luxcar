'use client';
import SwiperSlideCarShowCase from '@/components/LandingPage/SwiperSlide';
import MessageBanner from '../../MessageBanner';
import { Box, Button, Divider, Fab, Link, Typography } from '@mui/material';
import PopularCar from './PopularCar';
import { useRouter } from 'next/navigation';
import TelegramIcon from '@mui/icons-material/Telegram';

const Homepage = () => {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f2f2', position: 'relative' }}>
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: '999' }}>
        <Fab color='primary' aria-label='add' component={Link} href='https://t.me/lkkkk12345' target='_blank'>
          <TelegramIcon />
        </Fab>
      </Box>
      {/* Promotional Banner */}
      <MessageBanner />
      {/* Carousel */}
      <Box sx={{ mt: 0 }}>
        <SwiperSlideCarShowCase />
      </Box>
      <Box sx={{ width: '100%', height: '100%' }}>
        <PopularCar />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Divider sx={{ my: 2, width: '60%' }} />
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
