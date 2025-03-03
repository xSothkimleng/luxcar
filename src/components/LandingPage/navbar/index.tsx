'use client';
import React from 'react';
import Image from 'next/image';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Custom button style with hover animation
  const buttonStyle = (path: string) => ({
    color: 'black',
    fontWeight: pathname === path ? 'bold' : 'normal',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: pathname === path ? '100%' : '0%',
      height: '3px',
      backgroundColor: 'red',
      transition: 'width 0.3s ease-in-out',
    },
    '&:hover::after': {
      width: '100%',
    },
  });

  return (
    <AppBar position='sticky' sx={{ backgroundColor: 'white' }} elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo container with proper sizing */}
        <Box
          onClick={() => router.push('/')}
          component='div'
          sx={{
            position: 'relative',
            width: 140,
            height: 50,
            cursor: 'pointer',
          }}>
          <Image
            src='/assets/images/lux-logo.png'
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
            <Button color='inherit' sx={buttonStyle('/')} onClick={() => router.push('/')}>
              Home
            </Button>
            <Button color='inherit' sx={buttonStyle('/shop')} onClick={() => router.push('/shop')}>
              Shop Collection
            </Button>
            <Button color='inherit' sx={buttonStyle('/contact')} onClick={() => router.push('/contact')}>
              Contact
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
