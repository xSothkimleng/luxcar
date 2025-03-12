'use client';
import * as React from 'react';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';

import { dummyCars } from '@/data/cars';
import { Car } from '@/types/car';

const SwiperSlideCarShowCase = () => {
  const [cars] = useState<Car[]>(dummyCars);

  // Filter featured cars - since 'featured' is no longer in the Car type,
  // we'll display the first 4 cars instead
  const displayCars = cars.slice(0, 4);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      modules={[Navigation, Pagination, Autoplay]}
      style={{ height: '600px' }}>
      {displayCars.map((car, index) => (
        <SwiperSlide key={index}>
          <Box
            sx={{
              position: 'relative',
              height: '600px',
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
                opacity: 0.4,
                backgroundImage: `url(${car.thumbnailImage?.url || ''})`,
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
                      variant='overline'
                      color='#cc0000'
                      fontWeight='bold'
                      sx={{ letterSpacing: 2, mb: 1, display: 'block' }}>
                      {car.brand?.name || ''}
                    </Typography>
                    <Typography
                      variant='h2'
                      color='white'
                      fontWeight='bold'
                      gutterBottom
                      sx={{
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                      }}>
                      {car.name}
                    </Typography>
                    <Typography variant='h5' color='white' sx={{ mb: 3, opacity: 0.9 }}>
                      Starting at ${car.price.toLocaleString('en-US')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                      <Link href='/shop' passHref>
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
                      {car.thumbnailImage && (
                        <Image
                          src={car.thumbnailImage.url}
                          alt={car.name}
                          fill
                          style={{
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                          }}
                          quality={100}
                        />
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
  );
};

export default SwiperSlideCarShowCase;
