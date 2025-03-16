import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box, Typography, Grid, Paper, Modal, Fade, IconButton, Backdrop } from '@mui/material';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import { Car } from '@/types/car';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

interface CarDetailProps {
  car: Car | null;
  onBack?: () => void;
}

const CarDetail = ({ car }: CarDetailProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [openImageFullScreen, setOpenImageFullScreen] = useState(false);

  const handleOpenImageFullScreen = () => {
    setOpenImageFullScreen(true);
  };

  const handleCloseImageFullScreen = () => {
    setOpenImageFullScreen(false);
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageUrls && imageUrls.length > 1) {
      setActiveImage(prev => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    }
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageUrls && imageUrls.length > 1) {
      setActiveImage(prev => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    }
  };

  if (!car) {
    return (
      <Box className='p-4'>
        <Typography>No car information available.</Typography>
      </Box>
    );
  }

  // Create images array from either the legacy format or the new Prisma schema format
  const imageUrls = car.thumbnailImage?.url
    ? [car.thumbnailImage.url, ...(car.variantImages?.map(img => img.url) || [])]
    : ['/assets/images/placeholder.jpg'];

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Image Gallery Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 0, overflow: 'hidden' }}>
            {/* Main Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '300px', md: '500px' },
                backgroundColor: '#f5f5f5',
                cursor: imageUrls && imageUrls.length > 0 ? 'pointer' : 'default',
                '&:hover .image-overlay': {
                  opacity: 1,
                },
              }}
              onClick={imageUrls && imageUrls.length > 0 ? handleOpenImageFullScreen : undefined}>
              {imageUrls && imageUrls.length > 0 ? (
                <>
                  <Image
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    src={imageUrls[activeImage]}
                    alt={`${car.name} - Image ${activeImage + 1}`}
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <Box
                    className='image-overlay'
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}>
                    <ZoomOutMapIcon sx={{ color: 'white', fontSize: '2rem' }} />
                  </Box>
                </>
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

            {/* Fullscreen Modal */}
            <Modal
              open={openImageFullScreen}
              onClose={handleCloseImageFullScreen}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Fade in={openImageFullScreen}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={handleCloseImageFullScreen}>
                  {/* Close button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: { xs: '35%', md: 70 },
                      right: { xs: '40%', md: 350 },
                      transform: { xs: 'translate(-50%,-50%)', md: 'none' },
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={handleCloseImageFullScreen}>
                    <CloseIcon />
                  </IconButton>

                  {/* Navigation arrows for fullscreen */}
                  {imageUrls && imageUrls.length > 1 && (
                    <>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          left: 20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          zIndex: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={handlePrevious}>
                        <ChevronLeftIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          right: 20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          zIndex: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={handleNext}>
                        <ChevronRightIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </>
                  )}

                  {/* Fullscreen image */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '100%', md: '90%' },
                      height: { xs: '100%', md: '90%' },
                      maxWidth: '1500px',
                      maxHeight: { xs: '100vh', md: '90vh' },
                    }}
                    onClick={e => e.stopPropagation()}>
                    <Image
                      fill
                      src={imageUrls[activeImage]}
                      alt={`${car.name} - Image ${activeImage + 1}`}
                      style={{
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                      sizes='100vw'
                      priority
                    />
                  </Box>

                  {/* Image counter */}
                  {imageUrls && imageUrls.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.875rem',
                      }}>
                      {`${activeImage + 1} / ${imageUrls.length}`}
                    </Box>
                  )}
                </Box>
              </Fade>
            </Modal>

            {/* Thumbnail Gallery */}
            {imageUrls && imageUrls.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
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

        {/* Enhanced Details Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            {/* Car Name Section */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  letterSpacing: '-0.5px',
                  color: '#1a1a1a',
                }}>
                {car.name}
              </Typography>
            </Box>

            {/* Key Facts Section - Each in its own row */}
            <Box
              sx={{
                mb: 3,
                borderRadius: 2,
              }}>
              {/* Model */}
              {car.model && (
                <Box
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}>
                  <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                    Model:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <DirectionsCarIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                    <Typography variant='body1' fontWeight='500'>
                      {car.model.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Brand */}
              {car.brand && (
                <Box
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}>
                  <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                    Brand:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <BusinessIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                    <Typography variant='body1' fontWeight='500'>
                      {car.brand.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Scale */}
              {car.scale && (
                <Box
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}>
                  <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                    Scale:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <AspectRatioIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                    <Typography variant='body1' fontWeight='500'>
                      {car.scale}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Tag */}
              {car.tag && (
                <Box
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}>
                  <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                    Tag:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <LocalOfferIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                    <Typography variant='body1' fontWeight='500'>
                      {car.tag}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Color */}
              {car.color && (
                <Box
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}>
                  <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                    Color:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: car.color?.rgb || '#ddd',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                    <Typography variant='body1' fontWeight='500'>
                      {car.color?.name || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Price */}
              <Box
                sx={{
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Typography variant='body2' color='text.secondary' sx={{ width: '100px' }}>
                  Price:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: '1.5rem', color: '#D32F2F' }} />
                  <Typography variant='h6' fontWeight='700' color='#D32F2F'>
                    {typeof car.price === 'number'
                      ? car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : parseFloat(car.price).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Description Section */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                gutterBottom
                sx={{
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                <DescriptionIcon sx={{ fontSize: '1.2rem' }} />
                Description
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  maxHeight: '250px',
                  overflow: 'auto',
                  p: 2,
                  border: '1px solid #f0f0f0',

                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#dddddd',
                    borderRadius: '4px',
                  },
                }}>
                <Typography
                  variant='body1'
                  component='div'
                  sx={{
                    lineHeight: 1.6,
                    color: '#333',
                    '& p': { mb: 1.5 },
                  }}
                  className='car-description'
                  dangerouslySetInnerHTML={{ __html: car.description }}
                />
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarDetail;
