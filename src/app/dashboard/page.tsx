'use client';
import * as React from 'react';
import { useState } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import ToysIcon from '@mui/icons-material/Toys';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatsCard from '@/components/StatsCard';
import Grid from '@mui/material/Grid';
import { Dialog, DialogContent, DialogTitle, Skeleton } from '@mui/material';
import BannerPreviewCard from '@/components/BannerPreviewCard';
import { Box, Typography, Button, Alert } from '@mui/material';
import BannerSlideForm from '@/components/Form/BannerForm';
import { useBannerSlides } from '@/hooks/useBanner';
import AddIcon from '@mui/icons-material/Add';
import { BannerSlide } from '@/types/banner';

const statsData = [
  {
    title: 'Total Products',
    value: 1254,
    icon: <ToysIcon sx={{ fontSize: 24, color: 'white' }} />,
    change: 12,
  },
  {
    title: 'Categories',
    value: 38,
    icon: <CategoryIcon sx={{ fontSize: 24, color: 'white' }} />,
    change: 3,
  },
  {
    title: 'Total Sales',
    value: 84621,
    icon: <AttachMoneyIcon sx={{ fontSize: 24, color: 'white' }} />,
    change: 18,
  },
];

const Dashboard = () => {
  const { data: bannerSlides, isLoading, error, refetch } = useBannerSlides();
  const [openAddSlideDialog, setOpenAddSlideDialog] = useState(false);

  const handleAddSlideSuccess = () => {
    setOpenAddSlideDialog(false);
    refetch(); // Refresh the banner slides data
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}>
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #2D3748 0%, #605BFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}>
            Dashboard
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}>
            Welcome back!
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StatsCard title={stat.title} value={stat.value} icon={stat.icon} change={stat.change} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              color: '#2D3748',
            }}>
            Banner Slides
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            Failed to load banner slides: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        )}

        <Grid container spacing={2}>
          {isLoading ? (
            // Show loading skeletons
            [...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={`skeleton-${index}`}>
                <Skeleton
                  variant='rectangular'
                  height={240}
                  sx={{
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  }}
                />
                <Skeleton
                  variant='text'
                  width='80%'
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  }}
                />
              </Grid>
            ))
          ) : bannerSlides && bannerSlides.length > 0 ? (
            <>
              {bannerSlides.map((slide: BannerSlide) => (
                <Grid item xs={12} sm={6} md={3} key={slide.id}>
                  <Box sx={{ width: '100%', aspectRatio: '1/1' }}>
                    <BannerPreviewCard slide={slide} onDelete={refetch} onEdit={refetch} />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '1/1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px dashed rgba(0,0,0,0.2)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    },
                  }}
                  onClick={() => setOpenAddSlideDialog(true)}>
                  <AddIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.3)', mb: 1 }} />
                  <Typography variant='body1' color='text.secondary'>
                    Add New Slide
                  </Typography>
                </Box>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                  }}>
                  <Typography align='center' color='text.secondary' gutterBottom>
                    No banner slides available
                  </Typography>
                  <Button variant='contained' startIcon={<AddIcon />} onClick={() => setOpenAddSlideDialog(true)} sx={{ mt: 2 }}>
                    Add Your First Slide
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Add Slide Dialog */}
      <Dialog fullWidth maxWidth='md' open={openAddSlideDialog} onClose={() => setOpenAddSlideDialog(false)}>
        <DialogTitle>Add New Slide</DialogTitle>
        <DialogContent>
          <BannerSlideForm onClose={() => setOpenAddSlideDialog(false)} onSuccess={handleAddSlideSuccess} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
