'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';

import { dummyCars } from '@/data/cars';
import { Car } from '@/types/car';

const SwiperSlideCarShowCase = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cars, setCars] = useState<Car[]>(dummyCars);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      modules={[Navigation, Pagination, Autoplay]}
      style={{ height: '400px' }}>
      {cars
        .filter(car => car.featured)
        .map((car, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: 'relative',
                height: '400px',
                bgcolor: '#111',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.6,
                  backgroundImage: `/assets/images/sampleCar.jpg`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Container>
                <Grid container alignItems='center'>
                  <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
                    <Typography variant='h3' color='white' fontWeight='bold' gutterBottom>
                      {car.name}
                    </Typography>
                    <Typography variant='h5' color='white' sx={{ mb: 2 }}>
                      Starting at ${car.price.toLocaleString('en-US')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ zIndex: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px',
                      }}>
                      <Box
                        component='div'
                        sx={{
                          width: '100%',
                          height: '70%',
                          position: 'relative',
                          border: '8px solid rgba(255,255,255,0.1)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        }}>
                        {/* Placeholder for car image */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.5)',
                          }}>
                          <Image src={car.images[0]} alt={car.name} layout='fill' objectFit='cover' quality={100} />
                        </Box>
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
