import { Box } from '@mui/material';

const MessageBanner = () => {
  return (
    <Box
      sx={{
        bgcolor: '#cc0000',
        color: 'white',
        textAlign: 'center',
        py: 1,
        fontWeight: 'bold',
      }}>
      Special Offer: Get 25% Off on Selected Luxury Models | Limited Time Offer
    </Box>
  );
};

export default MessageBanner;
