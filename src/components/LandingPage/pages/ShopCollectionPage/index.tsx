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
  Pagination,
  Stack,
} from '@mui/material';
import CarDetail from '@/components/CarDetail';
import CloseIcon from '@mui/icons-material/Close';
import { Car } from '@/types/car';
import FilterDrawer from '@/components/LandingPage/FilterDrawer';
import CarCard from '../../CarCard';
import CarCardSkeleton from '@/components/skeleton/CarCardSkeleton';
import TelegramIcon from '@mui/icons-material/Telegram';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSearchParams } from 'next/navigation';
import { usePaginatedCars, PaginatedCarsParams } from '@/hooks/usePaginatedCars';

// Constants
const ITEMS_PER_PAGE = 12; // Adjust as needed

const ShopCollectionPage = () => {
  const searchParams = useSearchParams();
  const modelIdFromQuery = searchParams.get('model');
  const pageFromQuery = searchParams.get('page');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // UI States
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Pagination and Filter States
  const [currentPage, setCurrentPage] = useState(pageFromQuery ? parseInt(pageFromQuery) : 1);
  const [filterParams, setFilterParams] = useState<Omit<PaginatedCarsParams, 'page' | 'limit'>>({
    sort: 'createdAt',
    order: 'desc',
    modelId: modelIdFromQuery || undefined,
  });

  // Combine pagination and filter params
  const queryParams: PaginatedCarsParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...filterParams,
  };

  // Fetch paginated and filtered cars
  const { data: paginatedData, isLoading, error } = usePaginatedCars(queryParams);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<PaginatedCarsParams>) => {
    setFilterParams(prev => ({
      ...prev,
      ...newFilters,
    }));

    // Reset to page 1 when filters change
    setCurrentPage(1);

    // Update URL with new parameters
    updateUrlParams({
      ...filterParams,
      ...newFilters,
      page: 1,
    });
  };

  // Handle page change
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Update URL with new page
    updateUrlParams({
      ...filterParams,
      page,
    });
  };

  // Update URL with query parameters
  const updateUrlParams = (params: Partial<PaginatedCarsParams>) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    // Set or clear each parameter
    if (params.page && params.page > 1) {
      urlParams.set('page', params.page.toString());
    } else {
      urlParams.delete('page');
    }

    if (params.modelId) {
      urlParams.set('model', params.modelId);
    } else {
      urlParams.delete('model');
    }

    // Replace URL without reloading the page
    const newUrl = `${url.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Handle view car details
  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenCarDialog(true);
  };

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
    return Array(ITEMS_PER_PAGE)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
          <CarCardSkeleton />
        </Grid>
      ));
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, position: 'relative' }}>
      {/* Telegram Contact Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: '999' }}>
        <Fab
          aria-label='add'
          component={Link}
          href='https://t.me/lkkkk12345'
          target='_blank'
          sx={{
            background: '#0088cc',
            color: '#fff',
            width: { xs: '3.5rem', md: '4rem' },
            height: { xs: '3.5rem', md: '4rem' },
          }}>
          <TelegramIcon sx={{ fontSize: { xs: '3rem', md: '3rem' }, marginRight: '0.3rem' }} />
        </Fab>
      </Box>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Box sx={{ position: 'fixed', bottom: { xs: 170, md: 90 }, right: 20, zIndex: '999' }}>
          <Fab
            size='small'
            aria-label='scroll to top'
            onClick={scrollToTop}
            sx={{
              boxShadow: 3,
              color: 'white',
              background: 'black',
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
              <FilterDrawer onFilterChange={handleFilterChange} initialFilters={filterParams} initialModelId={modelIdFromQuery} />
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
          ) : !paginatedData || paginatedData.items.length === 0 ? (
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
            <>
              {/* Product Grid */}
              <Grid container spacing={{ xs: 1, md: 2 }}>
                {paginatedData.items.map(car => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={car.id}>
                    <CarCard car={car} handleViewCar={handleViewCar} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination Controls */}
              {paginatedData.meta.totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
                  <Pagination
                    count={paginatedData.meta.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color='primary'
                    size={isMobile ? 'small' : 'medium'}
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '8px',
                      },
                      '& .Mui-selected': {
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                      },
                    }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    Showing {paginatedData.items.length} of {paginatedData.meta.totalItems} items
                  </Typography>
                </Stack>
              )}
            </>
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
          <FilterDrawer onFilterChange={handleFilterChange} initialFilters={filterParams} initialModelId={modelIdFromQuery} />
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
          {isLoading ? (
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
