import { Box, Typography, Divider, Chip, Grid, Paper, Button } from '@mui/material';
import Image from 'next/image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

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

const CarDetail = ({ car, onBack }: CarDetailProps) => {
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
    <Box className='max-w-6xl mx-auto'>
      {/* Back Button */}
      {onBack && (
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }} variant='text'>
          Back to all cars
        </Button>
      )}

      <Grid container spacing={4}>
        {/* Image Gallery Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Main Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                backgroundColor: '#f5f5f5',
              }}>
              {car.images && car.images.length > 0 ? (
                <Image
                  src={car.images[activeImage]}
                  alt={`${car.name} - Image ${activeImage + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
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
                    <Image src={image} alt={`Thumbnail ${index}`} fill sizes='80px' style={{ objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
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
                color='primary'
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
                  p: 2,
                  bgcolor: '#f9f9f9',
                  borderRadius: 2,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  mb: 2,
                }}>
                <div className='car-description' dangerouslySetInnerHTML={{ __html: car.description }} />
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
              <Button variant='contained' color='primary' fullWidth sx={{ py: 1.5 }}>
                Contact Seller
              </Button>
              <Button variant='outlined' color='primary' fullWidth sx={{ py: 1.5 }}>
                Test Drive
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Additional Details Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant='h6' fontWeight='bold' gutterBottom>
              Full Specifications
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {/* This would typically be populated with more car details */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Body Type
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  Sedan
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Year
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  2023
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Mileage
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  0 miles (New)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Fuel Type
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  Gasoline
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Transmission
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  Automatic
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Interior Color
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  Black
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarDetail;
