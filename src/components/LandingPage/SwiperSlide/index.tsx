'use client';
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Button, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useBannerSlides } from '@/hooks/useBanner';

// Loading Skeleton Component
const SwiperSkeleton = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '600px',
        bgcolor: '#222',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      <Container>
        <Grid container alignItems='center'>
          {/* Text content skeleton */}
          <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
            <Box sx={{ maxWidth: 500 }}>
              <Skeleton variant='text' width='80%' height={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant='text' width='60%' height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Skeleton variant='rectangular' width={150} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
            </Box>
          </Grid>

          {/* Image skeleton */}
          <Grid item xs={12} md={6} sx={{ zIndex: 2, position: 'relative', display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px',
                position: 'relative',
              }}>
              <Skeleton variant='rectangular' width='80%' height='70%' sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const SwiperSlideCarShowCase = () => {
  const { data: bannerSlides, isLoading, error } = useBannerSlides();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const swiperRef = React.useRef(null);

  // Handle error state
  React.useEffect(() => {
    if (error) {
      console.error('Error loading banner slides:', error);
    }
  }, [error]);

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Swiper spaceBetween={0} slidesPerView={1} modules={[Pagination]} style={{ height: '600px' }}>
        {[1, 2].map(item => (
          <SwiperSlide key={`skeleton-${item}`}>
            <SwiperSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  // If no data, show a fallback slide
  if (!bannerSlides || bannerSlides.length === 0) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '600px',
          bgcolor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography variant='h4' color='white'>
          No featured collections available
        </Typography>
      </Box>
    );
  }

  // Ensure we have enough slides for navigation and autoplay to make sense
  const shouldEnableFeatures = bannerSlides.length > 1;

  return (
    <Box
      sx={{
        position: 'relative',
        '.swiper-button-next, .swiper-button-prev': {
          color: 'white',
          '&:after': {
            fontSize: { xs: '24px', md: '32px' },
            textShadow: '0 0 5px rgba(0,0,0,0.5)',
          },
          display: shouldEnableFeatures ? 'flex' : 'none',
        },
        // Pagination dots styling
        '.swiper-pagination-bullet': {
          opacity: 0.5,
          backgroundColor: 'white',
          width: '10px',
          height: '10px',
          transition: 'all 0.3s ease',
        },
        '.swiper-pagination-bullet-active': {
          opacity: 1,
          backgroundColor: '#C6011F',
          width: '12px',
          height: '12px',
        },
      }}>
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={1}
        navigation={shouldEnableFeatures}
        pagination={{
          dynamicBullets: true,
        }}
        autoplay={
          shouldEnableFeatures
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        }
        modules={[Navigation, Pagination, Autoplay]}
        style={{ height: isMobile ? '420px' : '600px' }}
        onInit={swiper => {
          // Ensure navigation and autoplay are initialized
          if (shouldEnableFeatures && swiper) {
            setTimeout(() => {
              swiper.navigation.update();
              swiper.autoplay.start();
            }, 100);
          }
        }}>
        {bannerSlides.map(item => (
          <SwiperSlide key={item.id}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: '420px', md: '600px' },
                bgcolor: '#111',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              {/* Background with overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.5,
                  backgroundImage: `url(${item.bgImage?.url || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Container>
                <Grid container alignItems='center'>
                  {/* Text content */}
                  <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
                    <Box sx={{ maxWidth: 500 }}>
                      <Typography
                        variant='h2'
                        color='white'
                        fontWeight='bold'
                        gutterBottom
                        sx={{
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          fontSize: { xs: '2rem', md: '3.5rem' },
                        }}>
                        {item.title}
                      </Typography>
                      <Typography variant='h5' color='white' sx={{ mb: 3, opacity: 0.9, fontSize: { xs: '1rem', md: '2rem' } }}>
                        {item.subtitle}
                      </Typography>

                      {item.model?.id && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                          <Link href={`/shop?model=${item.model.id}`} passHref>
                            <Button
                              variant='outlined'
                              size='large'
                              sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                px: 3,
                              }}>
                              View Collection
                            </Button>
                          </Link>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Car image */}
                  <Grid item xs={12} md={6} sx={{ zIndex: 2, position: 'relative', display: { xs: 'none', md: 'block' } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '500px',
                        position: 'relative',
                      }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '70%',
                          position: 'relative',
                        }}>
                        {item.mainImage ? (
                          <Image
                            src={item.mainImage.url || ''}
                            alt={item.title}
                            fill
                            style={{
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                            }}
                            quality={100}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Typography color='white' variant='body2'>
                              Image not available
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default SwiperSlideCarShowCase;
