'use client';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography } from '@mui/material';
import ProductTable from '@/components/Table/Variants/ProductListTable';
import CarForm from '@/components/Form/CarForm';

const InventoryManagementPage = () => {
  const [openNewsDialog, setOpenNewsDialog] = useState(false);

  const handleToggleNewsDialog = () => {
    setOpenNewsDialog(prev => !prev);
  };

  return (
    <Box>
      <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
        Inventory Management
      </Typography>
      <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}>
        Manage all Product
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 50%)',
        }}>
        <Button
          variant='contained'
          color='success'
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={() => handleToggleNewsDialog()}
          sx={{
            margin: '1rem 0rem',
            borderRadius: '0px',
            fontWeight: 'bold',
            letterSpacing: 1,
            transition: 'all 0.2s',
            '&:hover': {
              background: 'rgb(25,118,210,1)',
              color: 'white',
              letterSpacing: 3,
            },
          }}>
          Add New Car
        </Button>
      </Paper>
      <div className='w-full overflow-hidden'>
        <div className='w-full'>
          <ProductTable />
        </div>
      </div>
      <Dialog fullWidth maxWidth='md' open={openNewsDialog} onClose={handleToggleNewsDialog}>
        <DialogTitle sx={{ background: 'black', color: 'white', padding: '0 1rem', marginBottom: '1.5rem' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>Add New Car Detail</Typography>
            <IconButton onClick={() => handleToggleNewsDialog()}>
              <CloseIcon sx={{ color: 'white', border: '1px solid white', borderRadius: '50%' }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CarForm onClose={handleToggleNewsDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InventoryManagementPage;
