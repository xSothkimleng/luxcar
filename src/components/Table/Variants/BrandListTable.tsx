import * as React from 'react';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GridTable from '@/components/Table';
import { useBrands, useDeleteBrand } from '@/hooks/useBrand';
import { Brand } from '@/types/brand';
import BrandForm from '@/components/Form/BrandForm';

const BrandListTable = () => {
  // UI States
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Data Fetching & Mutations
  const { data: brands, isLoading } = useBrands();
  const { mutateAsync: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  // Delete Handling
  const handleOpenDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBrand(null);
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;

    try {
      await deleteBrand(selectedBrand.id);
      setSnackbarSeverity('success');
      setSnackbarMessage('Brand deleted successfully!');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting brand:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to delete brand. Please try again.');
    }
  };

  // Edit Handling
  const handleOpenEditDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedBrand(null);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        renderCell: params => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <p style={{ color: '#2D3748', fontWeight: 'bold' }}>{params.value}</p>
          </Box>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => {
          const brand = brands?.find(b => b.id === params.row.id);
          if (!brand) return null;

          return (
            <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
              <Tooltip title='Edit' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenEditDialog(brand)}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(38, 198, 249, 0.1)',
                    color: '#26c6f9',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(38, 198, 249, 0.2)',
                      boxShadow: '0 4px 10px rgba(38, 198, 249, 0.2)',
                    },
                  }}>
                  <EditOutlinedIcon fontSize='small' />
                </Button>
              </Tooltip>
              <Tooltip title='Delete' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenDeleteDialog(brand)}
                  disabled={isDeleting && selectedBrand?.id === brand.id}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(231, 76, 60, 0.1)',
                    color: '#e74c3c',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'rgba(231, 76, 60, 0.2)',
                      boxShadow: '0 4px 10px rgba(231, 76, 60, 0.2)',
                    },
                  }}>
                  {isDeleting && selectedBrand?.id === brand.id ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <DeleteOutlineIcon fontSize='small' />
                  )}
                </Button>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [brands, isDeleting, selectedBrand],
  );

  return (
    <>
      <GridTable
        rows={brands || []}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={openEditDialog}
        onClose={handleCloseEditDialog}
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
              Edit Brand
            </Typography>
            <IconButton
              onClick={handleCloseEditDialog}
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
          {selectedBrand && (
            <BrandForm
              brand={selectedBrand}
              isEdit={true}
              onClose={handleCloseEditDialog}
              onSuccess={() => {
                setSnackbarSeverity('success');
                setSnackbarMessage('Brand updated successfully!');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
          },
        }}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#2D3748' }}>
              Delete Brand
            </Typography>
            <IconButton onClick={handleCloseDeleteDialog} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete the following brand?
          </Typography>
          {selectedBrand && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {selectedBrand.name}
              </Typography>
            </Box>
          )}
          <Alert severity='warning' sx={{ mt: 3 }}>
            This action cannot be undone. Any cars associated with this brand may be affected.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBrand}
            variant='contained'
            color='error'
            disabled={isDeleting}
            sx={{
              minWidth: '100px',
            }}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Zoom}>
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarMessage(null)}
          sx={{
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            fontWeight: 500,
          }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BrandListTable;
