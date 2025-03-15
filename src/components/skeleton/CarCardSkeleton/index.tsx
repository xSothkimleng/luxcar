import { Box, Card, CardContent, Skeleton } from '@mui/material';

const CarCardSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
      }}>
      <Box
        sx={{
          pt: '60%',
          position: 'relative',
          bgcolor: '#f5f5f5',
          overflow: 'hidden',
        }}>
        {/* Car image skeleton */}
        <Skeleton
          variant='rectangular'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: '#eeeeee',
          }}
          animation='wave'
        />

        {/* Brand Badge skeleton */}
        <Skeleton
          variant='rounded'
          width={60}
          height={24}
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
          }}
          animation='wave'
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, padding: '0' }}>
        {/* Car name skeleton */}
        <Skeleton variant='text' width='80%' height={24} animation='wave' />

        {/* Price skeleton */}
        <Skeleton variant='text' width='40%' height={24} animation='wave' />

        {/* Color code skeleton */}
        <Skeleton variant='text' width='60%' height={20} animation='wave' />
      </CardContent>
    </Card>
  );
};

export default CarCardSkeleton;
