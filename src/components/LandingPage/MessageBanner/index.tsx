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
      Free Delivery over 39$
    </Box>
  );
};

export default MessageBanner;
