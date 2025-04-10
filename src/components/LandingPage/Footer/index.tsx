'use client';
import Image from 'next/image';
import { Box, Grid, Typography, Divider, IconButton, Link } from '@mui/material';
import { info } from '@/data/info';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#2c2c2e', color: 'white', p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
            <Box
              component='div'
              sx={{
                position: 'relative',
                width: 140,
                height: 50,
                cursor: 'pointer',
              }}>
              <Image
                unoptimized
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
            Bringing joy to collectors and kids with high-quality toy cars! From vintage classics to modern speedsters
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Quick Links
          </Typography>
          <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
            <Box component='li' sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                href={info.facebook}
                target='_blank'
                sx={{
                  padding: '0',
                  color: '#1877F2',
                  '&:hover': { bgcolor: '#0d65d9', color: 'white' },
                }}>
                <FacebookIcon sx={{ fontSize: '1.5rem', padding: '0' }} />
              </IconButton>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'white', '&:hover': { color: 'gray' } }}
                component={Link}
                href={info.facebook}
                target='_blank'>
                Lux Cars Cambodia
              </Typography>
            </Box>
            <Box component='li' sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                href={info.instagram}
                target='_blank'
                sx={{
                  padding: '0',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: 'white',
                }}>
                <InstagramIcon sx={{ fontSize: '1.5rem', padding: '0' }} />
              </IconButton>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'white', '&:hover': { color: 'gray' } }}
                component={Link}
                href={info.instagram}
                target='_blank'>
                luxcar_cambodia
              </Typography>
            </Box>
            <Box component='li' sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                href={info.telegram}
                target='_blank'
                sx={{
                  padding: '0',
                  bgcolor: '#1877F2',
                  color: 'white',
                  '&:hover': { bgcolor: '#0d65d9' },
                }}>
                <TelegramIcon sx={{ fontSize: '1.5rem', padding: '2px' }} />
              </IconButton>
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'white', '&:hover': { color: 'gray' } }}
                component={Link}
                href={info.telegram}
                target='_blank'>
                Telegram
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Contact Us
          </Typography>
          <Typography variant='subtitle2' gutterBottom>
            Address: {info.address}
          </Typography>
          <Typography variant='subtitle2' gutterBottom>
            Email: {info.email}
          </Typography>
          <Typography variant='subtitle2' gutterBottom>
            Phone: {info.telephone}
          </Typography>
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
