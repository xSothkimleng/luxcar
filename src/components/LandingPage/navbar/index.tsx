'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigate and close drawer
  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  // Custom button style with hover animation for desktop
  const buttonStyle = (path: string) => ({
    color: 'white',
    fontWeight: pathname === path ? 'bold' : 'normal',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: pathname === path ? '100%' : '0%',
      height: '3px',
      backgroundColor: '#ff4d4d',
      transition: 'width 0.3s ease-in-out',
    },
    '&:hover::after': {
      width: '100%',
    },
  });

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#2c2c2e' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 40,
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
        <IconButton edge='end' onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ mt: 2 }}>
        {['Home', 'Shop Collection', 'Contact'].map((text, index) => {
          const path = index === 0 ? '/' : index === 1 ? '/shop' : '/contact';
          const isActive = pathname === path;

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(path)}
                sx={{
                  py: 2,
                  px: 3,
                  borderLeft: isActive ? '4px solid #ff4d4d' : '4px solid transparent',
                  bgcolor: isActive ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 77, 77, 0.05)',
                  },
                }}>
                <ListItemText
                  primary={text}
                  sx={{
                    color: 'white',
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 'bold' : 'normal',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 3 }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <Button
          variant='contained'
          fullWidth
          onClick={() => handleNavigation('/contact')}
          sx={{
            bgcolor: '#ff4d4d',
            color: 'white',
            py: 1.5,
            '&:hover': {
              bgcolor: '#ff3333',
            },
          }}>
          Get in Touch
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#2c2c2e' }} elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo container with proper sizing */}
        <Box
          onClick={() => router.push('/')}
          component='div'
          sx={{
            position: 'relative',
            width: { xs: 110, sm: 140 },
            height: { xs: 40, sm: 50 },
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
          {/* Desktop Navigation menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button sx={buttonStyle('/')} onClick={() => router.push('/')}>
              Home
            </Button>
            <Button color='inherit' sx={buttonStyle('/shop')} onClick={() => router.push('/shop')}>
              Shop Collection
            </Button>
            <Button color='inherit' sx={buttonStyle('/contact')} onClick={() => router.push('/contact')}>
              Contact
            </Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='end'
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant='temporary'
        anchor='right'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '320px',
            bgcolor: '#2c2c2e',
          },
        }}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
