import Image from 'next/image';
import { Box, Card, Typography, Chip } from '@mui/material';
import { Car } from '@/types/car';

interface CarCardProps {
  car: Car;
  handleViewCar: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, handleViewCar }) => {
  return (
    <Card
      onClick={() => handleViewCar(car)}
      sx={{
        position: 'relative',
        height: '300px',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#182830',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        },
      }}>
      {/* Header section with "CAR BLUEPRINT" */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '30px',
          backgroundColor: '#a8bd24',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          zIndex: 10,
        }}>
        <Typography variant='subtitle2' fontWeight='bold' sx={{ textTransform: 'uppercase', color: '#000' }}>
          Car Blueprint
        </Typography>
      </Box>

      {/* Car Name Section */}
      <Box
        sx={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: '100%',
          backgroundColor: '#0a1318',
          px: 2,
          py: 1,
          zIndex: 10,
        }}>
        <Typography variant='h6' fontWeight='bold' color='#fff'>
          {car.brand}
        </Typography>
        <Typography variant='subtitle1' color='#ccc'>
          {car.name}
        </Typography>
      </Box>

      {/* Car image with grid background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(24, 40, 48, 0.8), rgba(24, 40, 48, 0.8)), url("/assets/images/grid-bg.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '30px',
        }}>
        <Box
          sx={{
            position: 'relative',
            width: '75%',
            height: '60%',
            mt: 6,
          }}>
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))',
            }}
            quality={100}
          />
        </Box>
      </Box>

      {/* Bottom info section with price */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          p: 2,
          zIndex: 10,
        }}>
        {/* Blueprint icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#333',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M3 3H11V11H3V3Z' fill='#a8bd24' />
            <path d='M13 3H21V11H13V3Z' fill='#a8bd24' />
            <path d='M3 13H11V21H3V13Z' fill='#a8bd24' />
            <path d='M13 13H21V21H13V13Z' fill='#a8bd24' />
          </svg>
        </Box>

        {/* Price diamond */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderBottom: '30px solid #f07b3f',
              position: 'relative',
              mr: 1,
            }}>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '30px solid #f07b3f',
                position: 'absolute',
                top: '30px',
                left: '-15px',
              }}
            />
          </Box>
          <Typography color='#f8f8f8' fontWeight='bold'>
            {car.price.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Car type badge */}
      {car.type && (
        <Chip
          label={car.type}
          size='small'
          sx={{
            position: 'absolute',
            top: 95,
            right: 16,
            backgroundColor: '#f07b3f',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 20,
          }}
        />
      )}
    </Card>
  );
};

export default CarCard;
