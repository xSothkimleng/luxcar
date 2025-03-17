'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Typography,
  DialogContent,
  useMediaQuery,
  useTheme,
  Fab,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import CarDetail from '@/components/CarDetail';
import CloseIcon from '@mui/icons-material/Close';
import { Car } from '@/types/car';
import FilterDrawer from '@/components/LandingPage/FilterDrawer';
import CarCard from '../../CarCard';
import CarCardSkeleton from '@/components/skeleton/CarCardSkeleton';
import { useCars } from '@/hooks/useCar';
import TelegramIcon from '@mui/icons-material/Telegram';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSearchParams } from 'next/navigation';

const ShopCollectionPage = () => {
  const { data: cars, isLoading, error } = useCars();
  const searchParams = useSearchParams();
  const modelIdFromQuery = searchParams.get('model');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setIsDetailLoading(true);
    setOpenCarDialog(true);
    setIsDetailLoading(false);
  };

  useEffect(() => {
    if (cars) {
      setFilteredCars(cars);
    }
  }, [cars]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Generate skeleton placeholders
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={6} sm={6} md={4} key={`skeleton-${index}`}>
          <CarCardSkeleton />
        </Grid>
      ));
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, position: 'relative' }}>
      {/* Telegram Contact Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: '999' }}>
        <Fab
          color='primary'
          aria-label='contact'
          component={Link}
          href='https://t.me/lkkkk12345'
          target='_blank'
          sx={{
            boxShadow: 3,
            '&:hover': { transform: 'scale(1.05)' },
            transition: 'transform 0.2s',
          }}>
          <TelegramIcon />
        </Fab>
      </Box>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Box sx={{ position: 'fixed', bottom: { xs: 160, md: 80 }, right: 20, zIndex: '999' }}>
          <Fab
            size='small'
            color='secondary'
            aria-label='scroll to top'
            onClick={scrollToTop}
            sx={{
              boxShadow: 3,
              '&:hover': { transform: 'scale(1.2)' },
              transition: 'transform 0.2s',
            }}>
            <ArrowUpwardIcon />
          </Fab>
        </Box>
      )}

      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant='h5' fontWeight='bold' component='div'>
          Our Collection
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Browse all our available cars
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          Failed to load cars. Please try again later.
        </Alert>
      )}

      {/* Main Content - Filters and Products */}
      <Grid container spacing={3}>
        {/* Left Sidebar - Filters - Only on desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3} lg={2.5}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                position: 'sticky',
                top: '80px',
                borderRadius: 2,
                opacity: isLoading ? 0.7 : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
              }}>
              <FilterDrawer
                cars={cars || []}
                setFilteredCars={setFilteredCars}
                initialModelId={modelIdFromQuery} // Pass this prop
              />
            </Paper>
          </Grid>
        )}

        {/* Right Side - Product List - Full width on mobile */}
        <Grid item xs={12} md={9} lg={9.5}>
          {isLoading ? (
            // Show skeleton placeholders while loading
            <Grid container spacing={3}>
              {renderSkeletons()}
            </Grid>
          ) : filteredCars.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'rgba(0,0,0,0.03)',
                borderRadius: 2,
              }}>
              <Typography variant='h6' color='text.secondary' component='div'>
                No cars found matching your criteria
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={{ xs: 1, md: 2 }}>
              {filteredCars.map(car => (
                <Grid item xs={6} sm={6} md={4} key={car.id}>
                  <CarCard car={car} handleViewCar={handleViewCar} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer - Only on mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? 'none' : 'auto',
          }}>
          <FilterDrawer cars={cars || []} setFilteredCars={setFilteredCars} initialModelId={modelIdFromQuery} />
        </Box>
      )}

      {/* Car Detail Dialog */}
      <Dialog
        fullScreen={isMobile}
        fullWidth={!isMobile}
        maxWidth={isMobile ? false : 'lg'}
        open={openCarDialog}
        onClose={() => setOpenCarDialog(false)}
        TransitionProps={{
          onExited: () => setSelectedCar(null),
        }}
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            mt: isMobile ? '2rem' : 0,
            borderTopLeftRadius: isMobile ? '1rem' : 0,
            borderTopRightRadius: isMobile ? '1rem' : 0,
          },
        }}>
        <DialogContent sx={{ paddingTop: isMobile ? 0 : 1 }}>
          {isDetailLoading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
              }}>
              <CircularProgress size={60} />
              <Typography variant='body1' sx={{ mt: 2 }}>
                Loading car details...
              </Typography>
            </Box>
          ) : selectedCar ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton
                  onClick={() => setOpenCarDialog(false)}
                  sx={{
                    zIndex: 1,
                    color: 'black',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CarDetail car={selectedCar} onBack={() => setOpenCarDialog(false)} />
            </>
          ) : (
            <Typography p={4}>No car selected.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShopCollectionPage;
