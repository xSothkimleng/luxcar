'use client';
import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Car } from '@/types/car';
import CloseIcon from '@mui/icons-material/Close';
import CarDetail from '@/components/CarDetail';
import { Box, Dialog, DialogContent, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

interface CarThumbnailProps {
  car: Car;
}

const CarThumbnail: React.FC<CarThumbnailProps> = ({ car }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const imageUrl = car.thumbnailImage?.url || '/assets/images/placeholder.jpg';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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
          priority
          unoptimized
          src={imageUrl}
          alt={car.name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
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
          padding: '10px',
          paddingTop: '8px',
          transform: isHovered ? 'translateY(0)' : 'translateY(70%)',
          transition: 'transform 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
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
            $
            {typeof car.price === 'number'
              ? car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : parseFloat(car.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
      <Dialog
        fullScreen={isMobile}
        fullWidth={!isMobile}
        maxWidth={isMobile ? false : 'xl'}
        open={openCarDialog}
        onClose={() => setOpenCarDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            mt: isMobile ? '2rem' : 0,
            borderTopLeftRadius: isMobile ? '1rem' : 0,
            borderTopRightRadius: isMobile ? '1rem' : 0,
          },
        }}>
        <DialogContent sx={{ paddingTop: isMobile ? 0 : 1 }}>
          {car ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton
                  onClick={() => setOpenCarDialog(false)}
                  sx={{
                    zIndex: 1,
                    color: 'black',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.1)',
                    },
                  }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CarDetail car={car} onBack={() => setOpenCarDialog(false)} />
            </>
          ) : (
            <Typography p={4}>Something went wrong.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CarThumbnail;
