import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box, Typography, Divider, Chip, Grid, Paper } from '@mui/material';

// Define the Car type
interface Car {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  images: string[];
}

interface CarDetailProps {
  car: Car;
  onBack?: () => void;
}

const CarDetail = ({ car }: CarDetailProps) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!car) {
    return (
      <Box className='p-4'>
        <Typography>No car information available.</Typography>
      </Box>
    );
  }

  // Color displayed based on the car's color
  const getColorChip = (color: string) => {
    const colorMap: Record<string, string> = {
      black: '#000000',
      white: '#FFFFFF',
      silver: '#C0C0C0',
      gray: '#808080',
      red: '#FF0000',
      blue: '#0000FF',
      green: '#008000',
      yellow: '#FFFF00',
      orange: '#FFA500',
      purple: '#800080',
      brown: '#A52A2A',
      gold: '#FFD700',
    };

    const bgColor = colorMap[color.toLowerCase()] || '#CCCCCC';
    const textColor = ['white', 'yellow', 'silver', 'gold'].includes(color.toLowerCase()) ? '#000000' : '#FFFFFF';

    return (
      <Chip
        icon={<ColorLensIcon />}
        label={color}
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            color: textColor,
          },
        }}
      />
    );
  };

  return (
    <Box className='mx-auto'>
      <Grid container spacing={4}>
        {/* Image Gallery Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 0, overflow: 'hidden' }}>
            {/* Main Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '500px',
                backgroundColor: '#f5f5f5',
              }}>
              {car.images && car.images.length > 0 ? (
                <Image
                  src={car.images[activeImage]}
                  alt={`${car.name} - Image ${activeImage + 1}`}
                  fill
                  style={{ objectFit: 'fill' }}
                  priority
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}>
                  <DirectionsCarIcon sx={{ fontSize: 100, color: '#ccc' }} />
                </Box>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            {car.images && car.images.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                  },
                }}>
                {car.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setActiveImage(index)}
                    sx={{
                      position: 'relative',
                      width: '80px',
                      height: '60px',
                      m: 0.5,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === activeImage ? '2px solid #1976d2' : '2px solid transparent',
                      opacity: index === activeImage ? 1 : 0.7,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}>
                    <Image src={image} alt={`Thumbnail ${index}`} fill sizes='80px' style={{ objectFit: 'fill' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            {/* Car Name & Price */}
            <Box sx={{ mb: 2 }}>
              <Typography variant='h4' fontWeight='bold' gutterBottom>
                {car.name}
              </Typography>
              <Typography
                variant='h5'
                fontWeight='bold'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                <LocalOfferIcon />${car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Color Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Color
              </Typography>
              {getColorChip(car.color)}
            </Box>

            {/* Description */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Description
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  maxHeight: '220px',
                }}>
                <div className='car-description' dangerouslySetInnerHTML={{ __html: car.description }} />
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarDetail;
