import Image from 'next/image';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
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
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        cursor: 'pointer',
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
          <Image src={car.images[0]} alt={car.name} fill style={{ objectFit: 'fill' }} quality={100} />
        </Box>
        {/* Brand Badge */}
        {car.brand && (
          <Chip
            label={car.brand}
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
      </Box>
      <CardContent sx={{ flexGrow: 1, padding: '0' }}>
        <Typography variant='body1' component='div' noWrap sx={{ fontWeight: 'bold' }}>
          {car.name}
        </Typography>
        <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#D32F2F' }}>
          ${car.price.toLocaleString('en-US')}
        </Typography>
        <Typography variant='body2' sx={{ color: 'gray' }}>
          Color Code : {car.color}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CarCard;
