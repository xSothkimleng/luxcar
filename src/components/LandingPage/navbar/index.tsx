'use client';
import React from 'react';
import Image from 'next/image';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#000000' }} elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo container with proper sizing */}
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

        {/* Menu and icons container */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Navigation menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button color='inherit' sx={{ fontWeight: 'bold' }} onClick={() => router.push('/')}>
              Home
            </Button>
            <Button color='inherit' onClick={() => router.push('/shop')}>
              Shop Collection
            </Button>
            <Button color='inherit'>Contact</Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
