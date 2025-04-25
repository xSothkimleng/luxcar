'use client';
import * as React from 'react';
import { Swiper as SwiperClass } from 'swiper'; // Import Swiper class type
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Button, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useBannerSlides } from '@/hooks/useBanner';

// Loading Skeleton Component - Simplified for faster rendering
const SwiperSkeleton = () => {
  // Same as before
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '420px', md: '600px' },
        bgcolor: '#222',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      <Container>
        <Grid container alignItems='center'>
          <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
            <Box sx={{ maxWidth: 500 }}>
              <Skeleton variant='text' width='80%' height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant='text' width='60%' height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
              <Box sx={{ mt: 4 }}>
                <Skeleton variant='rectangular' width={150} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ zIndex: 2, position: 'relative', display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', height: '400px' }}>
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

  // Fix the TypeScript error by properly typing the ref
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if component is visible in the viewport to pause autoplay when not visible
  useEffect(() => {
    // Skip if SSR
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);

          // Now TypeScript knows swiperRef.current.swiper exists and has autoplay methods
          if (swiperRef.current && swiperRef.current.swiper) {
            if (entry.isIntersecting) {
              swiperRef.current.swiper.autoplay.start();
            } else {
              swiperRef.current.swiper.autoplay.stop();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Log errors but don't re-render
  useEffect(() => {
    if (error) {
      console.error('Error loading banner slides:', error);
    }
  }, [error]);

  // Memory cleanup on unmount
  useEffect(() => {
    return () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.destroy(true, true);
      }
    };
  }, []);

  // If loading, show only one skeleton instead of multiple
  if (isLoading) {
    return (
      <Box ref={containerRef} sx={{ height: { xs: '420px', md: '600px' } }}>
        <SwiperSkeleton />
      </Box>
    );
  }

  // If no data, show a simple fallback
  if (!bannerSlides || bannerSlides.length === 0) {
    return (
      <Box
        ref={containerRef}
        sx={{
          height: { xs: '420px', md: '600px' },
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

  const shouldEnableFeatures = bannerSlides.length > 1;

  return (
    <Box
      ref={containerRef}
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
          shouldEnableFeatures && isVisible
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        }
        modules={[Navigation, Pagination, Autoplay]}
        style={{ height: isMobile ? '420px' : '600px' }}
        onInit={swiper => {
          if (shouldEnableFeatures && swiper && isVisible) {
            setTimeout(() => {
              swiper.navigation.update();
              swiper.autoplay.start();
            }, 100);
          }
        }}>
        {/* Rest of your component remains the same */}
        {bannerSlides.map((item, index) => (
          <SwiperSlide key={item.id}>
            {/* Slide content remains the same */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: '420px', md: '600px' },
                bgcolor: '#111',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              {item.bgImage?.url && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.5,
                  }}>
                  <Image
                    unoptimized
                    src={item.bgImage.url}
                    alt=''
                    fill
                    style={{ objectFit: 'cover' }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    quality={75}
                    sizes='100vw'
                  />
                </Box>
              )}
              <Container maxWidth='xl'>
                <Grid container alignItems='center'>
                  <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
                    <Box sx={{ maxWidth: 500 }}>
                      <Typography
                        variant='h2'
                        color='white'
                        fontWeight='bold'
                        gutterBottom
                        sx={{
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          fontSize: { xs: '1.5rem', md: '3.5rem' },
                        }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant='h5'
                        color='white'
                        sx={{
                          mb: { xs: 1, md: 3 },
                          opacity: 0.9,
                          fontSize: { xs: '1rem', md: '2rem' },
                        }}>
                        {item.subtitle}
                      </Typography>

                      <Box
                        sx={{
                          display: { xs: 'flex', sm: 'none' },
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '200px',
                          position: 'relative',
                        }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                          }}>
                          {item.mainImage?.url ? (
                            <Image
                              unoptimized
                              src={item.mainImage.url}
                              alt={item.title}
                              fill
                              style={{
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                              }}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              quality={85}
                              sizes='(max-width: 768px) 100vw, 50vw'
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

                      {item.model?.id && (
                        <Box sx={{ display: 'flex', mt: { xs: 1, sm: 4 } }}>
                          <Link href={`/shop?model=${item.model.id}`} passHref>
                            <Button
                              variant='outlined'
                              size='large'
                              sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                px: { xs: 1, md: 3 },
                              }}>
                              View Collection
                            </Button>
                          </Link>
                        </Box>
                      )}
                    </Box>
                  </Grid>
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
                        {item.mainImage?.url ? (
                          <Image
                            unoptimized
                            src={item.mainImage.url}
                            alt={item.title}
                            fill
                            style={{
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                            }}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            quality={85}
                            sizes='(max-width: 768px) 100vw, 50vw'
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
