'use client';
import * as React from 'react';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography, Fade } from '@mui/material';
import BrandListTable from '@/components/Table/Variants/BrandListTable';
import BrandForm from '@/components/Form/BrandForm';

const BrandManagementPage = () => {
  const [openAddBrandDialog, setOpenAddBrandDialog] = useState(false);

  const handleToggleAddBrandDialog = () => {
    setOpenAddBrandDialog(prev => !prev);
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
            Brand Category Management
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}>
            Manage your Brand Categories
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleToggleAddBrandDialog}
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
          Add New Brand
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
        <BrandListTable />
      </Paper>

      {/* Add Brand Dialog */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={openAddBrandDialog}
        onClose={handleToggleAddBrandDialog}
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
            py: 2,
            px: 3,
          }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Add Brand
            </Typography>
            <IconButton
              onClick={handleToggleAddBrandDialog}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <BrandForm onClose={handleToggleAddBrandDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BrandManagementPage;
