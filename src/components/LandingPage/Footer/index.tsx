'use client';
import Image from 'next/image';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#2c2c2e', color: 'white', p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              component='div'
              sx={{
                position: 'relative',
                width: 140,
                height: 50,
                cursor: 'pointer',
              }}>
              <Image
                src='/assets/images/lux-logo-white.png'
                alt='LuxCar Logo'
                fill
                style={{
                  objectFit: 'contain',
                }}
                priority
              />
            </Box>
          </Box>
          <Typography variant='body2' color='gray.400' sx={{ mb: 2 }}>
            Your premier destination for luxury and performance vehicles. We offer the finest selection of premium cars with
            exceptional service.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Quick Links
          </Typography>
          <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
            <Box component='li' sx={{ mb: 1 }}>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}
                onClick={() => router.push('/')}>
                Home
              </Typography>
            </Box>
            <Box component='li' sx={{ mb: 1 }}>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}
                onClick={() => router.push('/shop')}>
                Shop Collections
              </Typography>
            </Box>
            <Box component='li' sx={{ mb: 1 }}>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}
                onClick={() => router.push('/contact')}>
                Contact
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Contact Us
          </Typography>
          <Typography variant='body2'>Tuol Kork, Phnom Penh, Cambodia</Typography>
          <Typography variant='body2'>Email: info@luxcars.com</Typography>
          <Typography variant='body2'>Phone: (855) 12 964 520</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
      <Typography variant='body2' align='center' color='gray.400'>
        © {new Date().getFullYear()} LUX CARS. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
