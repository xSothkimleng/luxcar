'use client';
import * as React from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import ToysIcon from '@mui/icons-material/Toys';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatsCard from '@/components/StatsCard';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';

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
    </Box>
  );
};

export default Dashboard;
