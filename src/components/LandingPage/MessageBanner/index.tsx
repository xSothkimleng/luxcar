import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const MessageBanner = () => {
  return (
    <Box
      sx={{
        bgcolor: 'rgb(210, 43, 43)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        width: '100%',
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          px: 2,
          borderRadius: '16px',
        }}>
        {/* Cambodia Flag */}

        <Box
          sx={{
            width: 40,
            height: 24,
            mr: 2,
            position: 'relative',
            display: { xs: 'block', sm: 'block' },
          }}>
          <Image
            unoptimized
            src='/assets/images/Flag_of_Cambodia.svg'
            alt='Cambodia Flag'
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Free Shipping Text */}
        <Typography
          variant='body2'
          sx={{
            mr: 1.5,
            fontWeight: 'bold',
            fontSize: { xs: '12px', sm: '14px' },
            textAlign: { xs: 'center', sm: 'left' },
          }}>
          FREE SHIPPING
        </Typography>

        {/* Country Name */}
        <Typography
          variant='body2'
          sx={{
            mr: 1.5,
            fontSize: { xs: '12px', sm: '14px' },
            display: { xs: 'none', sm: 'block' },
          }}>
          CAMBODIA
        </Typography>

        {/* Minimum Order Amount */}
        <Typography
          variant='body2'
          sx={{
            background: 'rgba(0,0,0,0.1)',
            p: 1,
            mr: 2,
            borderRadius: '16px',
            fontSize: { xs: '14px', sm: '14px' },
            color: 'black',
            textAlign: { xs: 'center', sm: 'left' },
          }}>
          On Orders Over
          <Box component='span' sx={{ fontWeight: 'bold' }}>
            $35
          </Box>
        </Typography>

        <Box
          sx={{
            width: 50,
            height: 18,
            position: 'relative',
          }}>
          <Image unoptimized src='/assets/images/grab.svg' alt='Grab Logo' fill style={{ objectFit: 'contain' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBanner;
