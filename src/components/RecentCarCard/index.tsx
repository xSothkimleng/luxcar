import { Car } from '@/types/car';
import { Box, Typography, Chip } from '@mui/material';
import Image from 'next/image';

interface RecentCarCardProps {
  car: Car;
}

const RecentCarCard: React.FC<RecentCarCardProps> = ({ car }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover': {
          '& .image-container': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 30px rgba(0, 0, 0, 0.15)',
          },
          '& .overlay': {
            opacity: 1,
          },
          '& .title': {
            color: '#605BFF',
          },
        },
      }}>
      <Box
        className='image-container'
        sx={{
          position: 'relative',
          width: '100%',
          height: '240px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
        <Image
          unoptimized
          src={car.thumbnailImage?.url || '/assets/images/lux-logo-white.pmg'}
          alt={car.name}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Gradient overlay */}
        <Box
          className='overlay'
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            // background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            opacity: 0.7,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px',
          }}
        />

        {/* Tags */}
        <Box sx={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: 1 }}>
          {/* {isNew && (
            <Chip
              label='NEW'
              size='small'
              sx={{
                backgroundColor: '#FF8C00',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          )} */}
          <Chip
            label={car.scale}
            size='small'
            sx={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        </Box>

        {/* Price tag */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            bgcolor: '#605BFF',
            color: 'white',
            fontWeight: 'bold',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '0.9rem',
          }}>
          {car.price}
        </Box>
      </Box>

      <Box sx={{ mt: 2, px: 0.5 }}>
        <Typography
          className='title'
          variant='subtitle1'
          sx={{
            fontWeight: '600',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            height: '2.6em',
            transition: 'color 0.3s ease-in-out',
          }}>
          {car.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentCarCard;
