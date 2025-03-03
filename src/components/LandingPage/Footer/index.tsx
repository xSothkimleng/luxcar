import Image from 'next/image';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';

const carTypes = ['All Types', 'Luxury', 'Sports', 'Sedan', 'Electric', 'Hybrid'];

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#111', color: 'white', mt: 6, py: 4 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component='div'
                sx={{
                  position: 'relative',
                  width: 140, // Adjust width as needed
                  height: 50, // Adjust height as needed
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
          <Grid item xs={12} md={2}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Quick Links
            </Typography>
            <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component='li' sx={{ mb: 1 }}>
                <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                  Home
                </Typography>
              </Box>
              <Box component='li' sx={{ mb: 1 }}>
                <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                  Collections
                </Typography>
              </Box>
              <Box component='li' sx={{ mb: 1 }}>
                <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                  Shop
                </Typography>
              </Box>
              <Box component='li' sx={{ mb: 1 }}>
                <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                  Contact
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Car Categories
            </Typography>
            <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {carTypes.slice(1).map(type => (
                <Box component='li' key={type} sx={{ mb: 1 }}>
                  <Typography
                    variant='body2'
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: '#ffd700' },
                    }}>
                    {type} Cars
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Contact Us
            </Typography>
            <Typography variant='body2' paragraph>
              123 Luxury Lane, Beverly Hills, CA 90210
            </Typography>
            <Typography variant='body2' paragraph>
              Email: info@luxcars.com
            </Typography>
            <Typography variant='body2' paragraph>
              Phone: (800) 123-4567
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant='body2' align='center' color='gray.400'>
          © {new Date().getFullYear()} LUX CARS. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
