import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box, Typography, Divider, Chip, Grid, Paper } from '@mui/material';
import { Car } from '@/types/car';

interface CarDetailProps {
  car: Car | null;
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

  // Get color name from either the legacy format or the new Prisma schema format
  const colorName = typeof car.color === 'string' ? car.color : car.color?.name || 'Unknown';

  // Create images array from either the legacy format or the new Prisma schema format
  const imageUrls = car.thumbnailImage?.url
    ? [car.thumbnailImage.url, ...(car.variantImages?.map(img => img.url) || [])]
    : ['/assets/images/placeholder.jpg'];

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

    // Try to use the RGB value from Prisma if available
    const rgbValue = typeof car.color === 'object' && car.color?.rgb;
    const bgColor = rgbValue || colorMap[color.toLowerCase()] || '#CCCCCC';

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

  // Display brand and model if available
  const brandModel = car.brand?.name && car.model?.name ? `${car.brand.name} ${car.model.name}` : car.name;

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
              {imageUrls && imageUrls.length > 0 ? (
                <Image
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  src={imageUrls[activeImage]}
                  alt={`${car.name} - Image ${activeImage + 1}`}
                  style={{ objectFit: 'cover' }}
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
            {imageUrls && imageUrls.length > 0 && (
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
                {imageUrls.map((image, index) => (
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
                {brandModel}
              </Typography>

              {/* Scale information if available */}
              {car.scale && (
                <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 1 }}>
                  Scale: {car.scale}
                </Typography>
              )}

              <Typography
                variant='h5'
                fontWeight='bold'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                <LocalOfferIcon />$
                {typeof car.price === 'number'
                  ? car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : parseFloat(car.price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Color Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Color
              </Typography>
              {getColorChip(colorName)}
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
                  overflow: 'auto',
                  p: 2,
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
