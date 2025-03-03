'use client';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography, Fade } from '@mui/material';
import CarForm from '@/components/Form/CarForm';
import ColorListTable from '@/components/Table/Variants/ColorListTable';

const ColorManagementPage = () => {
  const [openAddCarDialog, setOpenAddCarDialog] = useState(false);

  const handleToggleAddCarDialog = () => {
    setOpenAddCarDialog(prev => !prev);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #2D3748 0%, #605BFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}>
            Color Category Management
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}>
            Manage your Color Category
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleToggleAddCarDialog}
          sx={{
            borderRadius: '30px',
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
            boxShadow: '0 4px 14px rgba(96, 91, 255, 0.3)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #4F4AD0 0%, #7A74E0 100%)',
              boxShadow: '0 6px 20px rgba(96, 91, 255, 0.4)',
            },
          }}>
          Add New Color
        </Button>
      </Box>

      {/* Table Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(230, 232, 240, 0.8)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}>
        <ColorListTable />
      </Paper>

      {/* Add Car Dialog */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={openAddCarDialog}
        onClose={handleToggleAddCarDialog}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}>
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
            color: 'white',
            py: 2,
            px: 3,
          }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Add New Toy Car
            </Typography>
            <IconButton
              onClick={handleToggleAddCarDialog}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <CarForm onClose={handleToggleAddCarDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ColorManagementPage;
