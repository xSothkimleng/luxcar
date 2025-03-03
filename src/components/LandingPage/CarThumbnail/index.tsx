'use client';
import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Car } from '@/types/car';
import CloseIcon from '@mui/icons-material/Close';
import CarDetail from '@/components/CarDetail';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

interface CarThumbnailProps {
  car: Car;
}

const CarThumbnail: React.FC<CarThumbnailProps> = ({ car }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openCarDialog, setOpenCarDialog] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Car Image */}
      <Box
        onClick={() => setOpenCarDialog(true)}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.4s ease-in-out',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}>
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          style={{
            objectFit: 'cover',
          }}
          quality={100}
        />
      </Box>

      {/* Overlay information that slides up on hover */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '15px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)',
          transform: isHovered ? 'translateY(0)' : 'translateY(70%)',
          transition: 'transform 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        <Typography variant='subtitle1' sx={{ color: 'white', fontWeight: 'bold' }}>
          {car.name}
        </Typography>

        {car.price > 0 && (
          <Typography
            variant='body2'
            sx={{
              color: 'white',
              bgcolor: '#cc0000',
              display: 'inline-block',
              alignSelf: 'flex-start',
              px: 1,
              py: 0.5,
              borderRadius: '4px',
              fontWeight: 'bold',
            }}>
            ${car.price.toLocaleString('en-US')}
          </Typography>
        )}

        <Typography
          variant='body2'
          onClick={() => setOpenCarDialog(true)}
          sx={{
            color: 'white',
            opacity: 0.8,
            display: 'inline-block',
            alignSelf: 'flex-start',
            px: 1,
            py: 0.5,
            borderRadius: '4px',
            fontWeight: 'medium',
            bgcolor: 'rgba(255,255,255,0.1)',
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.4s ease-in-out 0.1s, opacity 0.4s ease-in-out 0.1s',
          }}>
          View Details
        </Typography>
      </Box>
      <Dialog fullWidth maxWidth='xl' open={openCarDialog} onClose={() => setOpenCarDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setOpenCarDialog(false)}
            sx={{
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {car ? (
            <CarDetail car={car} onBack={() => setOpenCarDialog(false)} />
          ) : (
            <Typography p={4}>Sth Wrong for real.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CarThumbnail;
