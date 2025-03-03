import { Box, Typography, Paper } from '@mui/material';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change = 12 }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        border: '1px solid rgba(230, 232, 240, 0.8)',
        boxShadow: '0 4px 16px rgba(96, 91, 255, 0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(96, 91, 255, 0.12)',
        },
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant='subtitle1'
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'text.secondary',
              mb: 1,
            }}>
            {title}
          </Typography>

          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
              color: '#2D3748',
              mb: 1,
            }}>
            {value.toLocaleString()}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: change >= 0 ? '#38B2AC' : '#E53E3E',
              }}>
              {change >= 0 ? '+' : ''}
              {change}%
            </Typography>
            <Typography
              variant='caption'
              sx={{
                ml: 0.5,
                color: 'text.secondary',
              }}>
              vs. last month
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
            boxShadow: '0 4px 10px rgba(96, 91, 255, 0.3)',
          }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCard;
