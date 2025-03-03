import SwiperSlideCarShowCase from '@/components/LandingPage/SwiperSlide';
import MessageBanner from '../../MessageBanner';
import { Box } from '@mui/material';

const Homepage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Promotional Banner */}
      <MessageBanner />

      {/* Carousel */}
      <Box sx={{ mt: 0 }}>
        <SwiperSlideCarShowCase />
      </Box>
    </Box>
  );
};

export default Homepage;
