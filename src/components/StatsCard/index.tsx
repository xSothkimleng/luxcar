import { Box, Typography, Paper } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 0,
      background: 'white',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      },
    }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon}
      </Box>
      <Box>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            mb: 1,
          }}>
          {value}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            color: 'rgba(0,0,0,0.6)',
            fontWeight: 'bold',
          }}>
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default StatsCard;
