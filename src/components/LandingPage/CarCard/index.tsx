import Image from 'next/image';
import { Box, Card, Chip, Typography } from '@mui/material';
import { Car } from '@/types/car';

interface CarCardProps {
  car: Car;
  handleViewCar: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, handleViewCar }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => handleViewCar(car)}>
      <Box
        sx={{
          pt: '60%',
          position: 'relative',
          bgcolor: '#f5f5f5',
          overflow: 'hidden',
        }}>
        {/* Car image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#eee',
            '&:hover': {
              bgcolor: '#e0e0e0',
            },
          }}>
          <Image
            unoptimized
            src={car.thumbnailImage?.url || '/assets/images/lux-logo.png'}
            alt={car.name}
            fill
            style={{ objectFit: 'fill' }}
            quality={100}
          />
        </Box>
        {/* Brand Badge */}
        {car.brand && (
          <Chip
            label={car.brand.name}
            size='small'
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        )}
        {car.tag && (
          <Chip
            label={car.tag}
            size='small'
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'white',
              color: 'red',
              fontWeight: 'bolder',
            }}
          />
        )}
      </Box>
      <Box sx={{ flexGrow: 1, mt: { xs: 0.5, md: 1 }, padding: '0', pb: { xs: '0.5rem', md: '2rem' } }}>
        <Typography variant='body1' component='div' noWrap sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {car.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#D32F2F', fontSize: { xs: '0.8rem', md: '1rem' } }}>
            ${' '}
            {typeof car.price === 'number'
              ? car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : parseFloat(car.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </Typography>
          {car.scale && (
            <Typography variant='body2' sx={{ color: 'gray', fontWeight: 'medium', fontSize: { xs: '0.8rem', md: '1rem' } }}>
              Scale :{car.scale}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CarCard;
