/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Box, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ToysIcon from '@mui/icons-material/Toys';
import StatsCard from '@/components/StatsCard';
import Grid from '@mui/material/Grid2';
import { Skeleton } from '@mui/material';
import RecentAnimeCard from '@/components/RecentAnimeCard';
import { useEffect, useState } from 'react';

const dummyData = {
  data: {
    totals: {
      anime: 3542,
      episodes: 72819,
      users: 15834,
    },
    recent: {
      anime: [
        {
          _id: '1',
          title: 'McLaren 720S GT3 Evo Pfaff Motorsports 2024 IMSA Daytona 24 Hrs',
          posterUrl: '/assets/images/sampleCar.jpg',
        },
        {
          _id: '2',
          title: 'Nissan Skyline GT-R (R33) Imai Racing V1',
          posterUrl: '/assets/images/sampleCar.jpg',
        },
        {
          _id: '3',
          title: 'Honda NSX (NA1) Kaido WORKS V2',
          posterUrl: '/assets/images/sampleCar.jpg',
        },
        {
          _id: '4',
          title: 'Chevrolet Silverado “Sumatran Rhino” KAIDO x MIZU Diecast',
          posterUrl: '/assets/images/sampleCar.jpg',
        },
      ],
    },
  },
};

const Dashboard = () => {
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
      title: 'Total Car Product',
      value: 1000,
      icon: <ToysIcon sx={{ fontSize: 32, color: 'white' }} />,
    },
    {
      title: 'Total Categories ',
      value: 200,
      icon: <CategoryIcon sx={{ fontSize: 32, color: 'white' }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: '1rem' }}>
        <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}>
          Overview Of Inventory
        </Typography>
      </Box>

      {/* Stats Cards Grid */}
      <Grid container spacing={3} sx={{ mb: '1rem' }}>
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <Grid size={4} key={index}>
              <Skeleton
                variant='rectangular'
                height={160}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          ))
        ) : error ? (
          <Grid size={12}>
            <Typography color='error' align='center'>
              Failed to load dashboard statistics
            </Typography>
          </Grid>
        ) : (
          // Show stats cards
          statsData.map((stat, index) => (
            <Grid size={4} key={index}>
              <StatsCard title={stat.title} value={stat.value} icon={stat.icon} />
            </Grid>
          ))
        )}
      </Grid>

      <Grid container spacing={3} sx={{ mb: '1rem' }}>
        <Grid size={12}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,1)' }}>
            Recent Anime
          </Typography>
        </Grid>
        {isLoading ? (
          // Show loading skeletons for recent anime
          [...Array(4)].map((_, index) => (
            <Grid size={3} key={`skeleton-${index}`}>
              <Skeleton
                variant='rectangular'
                height={300}
                sx={{
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  mb: 2,
                }}
              />
              <Skeleton
                variant='text'
                width='80%'
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          ))
        ) : error ? (
          <Grid size={12}>
            <Typography color='error' align='center'>
              Failed to load recent anime
            </Typography>
          </Grid>
        ) : dashboardData?.data.recent.anime && dashboardData.data.recent.anime.length > 0 ? (
          // Show recent anime cards
          dashboardData.data.recent.anime.map(anime => (
            <Grid size={3} key={anime._id}>
              <RecentAnimeCard title={anime.title} posterUrl={anime.posterUrl} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography align='center' color='text.secondary'>
              No recent anime available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
