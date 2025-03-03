/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Box, Typography, Button, InputBase, Paper, Divider, Tab, Tabs } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ToysIcon from '@mui/icons-material/Toys';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatsCard from '@/components/StatsCard';
import Grid from '@mui/material/Grid';
import { Skeleton } from '@mui/material';
import RecentCarCard from '@/components/RecentCarCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const dummyData = {
  data: {
    recent: {
      product: [
        {
          _id: '1',
          title: 'McLaren 720S GT3 Evo Pfaff Motorsports 2024 IMSA Daytona 24 Hrs',
          posterUrl: '/assets/images/sampleCar.jpg',
          price: '$79.99',
          isNew: true,
          scale: '1:64',
        },
        {
          _id: '2',
          title: 'Nissan Skyline GT-R (R33) Imai Racing V1',
          posterUrl: '/assets/images/sampleCar.jpg',
          price: '$64.99',
          isNew: true,
          scale: '1:64',
        },
        {
          _id: '3',
          title: 'Honda NSX (NA1) Kaido WORKS V2',
          posterUrl: '/assets/images/sampleCar.jpg',
          price: '$69.99',
          isNew: false,
          scale: '1:43',
        },
        {
          _id: '4',
          title: 'Chevrolet Silverado "Sumatran Rhino" KAIDO x MIZU Diecast',
          posterUrl: '/assets/images/sampleCar.jpg',
          price: '$89.99',
          isNew: true,
          scale: '1:24',
        },
      ],
    },
  },
};

const Dashboard = () => {
  const router = useRouter();

  type DashboardData = typeof dummyData | null;
  const [dashboardData, setDashboardData] = useState<DashboardData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setDashboardData(dummyData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

        <Paper
          component='form'
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 300,
            borderRadius: 8,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
          <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        </Paper>
      </Box>

      {/* Stats Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Skeleton
                variant='rectangular'
                height={160}
                sx={{
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                }}
              />
            </Grid>
          ))
        ) : error ? (
          <Grid item xs={12}>
            <Typography color='error' align='center'>
              Failed to load dashboard statistics
            </Typography>
          </Grid>
        ) : (
          // Show stats cards
          statsData.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StatsCard title={stat.title} value={stat.value} icon={stat.icon} change={stat.change} />
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              color: '#2D3748',
            }}>
            Newly Added
          </Typography>
        </Box>

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
          ) : error ? (
            <Grid item xs={12}>
              <Typography color='error' align='center'>
                Failed to load products
              </Typography>
            </Grid>
          ) : dashboardData?.data.recent.product && dashboardData.data.recent.product.length > 0 ? (
            dashboardData.data.recent.product.map(item => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <RecentCarCard
                  title={item.title}
                  posterUrl={item.posterUrl}
                  price={item.price}
                  isNew={item.isNew}
                  scale={item.scale}
                />
              </Grid>
            ))
          ) : (
            <Grid xs={12}>
              <Typography align='center' color='text.secondary'>
                No products available
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button
          onClick={() => router.push('/dashboard/inventory-management/product')}
          variant='contained'
          sx={{
            borderRadius: '30px',
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
            boxShadow: '0 4px 14px rgba(96, 91, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F4AD0 0%, #7A74E0 100%)',
              boxShadow: '0 6px 20px rgba(96, 91, 255, 0.4)',
            },
          }}>
          View All Products
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
