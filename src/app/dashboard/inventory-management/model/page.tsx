'use client';
import * as React from 'react';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography, Fade } from '@mui/material';
import ModelListTable from '@/components/Table/Variants/ModelListTable';
import ModelForm from '@/components/Form/ModelForm';

const ModelManagementPage = () => {
  const [openAddModelDialog, setOpenAddModelDialog] = useState(false);

  const handleToggleAddModelDialog = () => {
    setOpenAddModelDialog(prev => !prev);
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
            Model Category Management
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}>
            Manage your Model Categories
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleToggleAddModelDialog}
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
          Add New Model
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
        <ModelListTable />
      </Paper>

      {/* Add Model Dialog */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={openAddModelDialog}
        onClose={handleToggleAddModelDialog}
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
              Add Model
            </Typography>
            <IconButton
              onClick={handleToggleAddModelDialog}
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
          <ModelForm onClose={handleToggleAddModelDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ModelManagementPage;
