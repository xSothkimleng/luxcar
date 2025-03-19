import * as React from 'react';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GridTable from '@/components/Table';
import { useStatuses, useDeleteStatus } from '@/hooks/useStatus';
import { Status } from '@/types/status';
import StatusForm from '@/components/Form/StatusForm';
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

const StatusListTable = () => {
  // UI States
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // Data Fetching & Mutations
  const { data: statuses, isLoading } = useStatuses();
  const { mutateAsync: deleteStatus, isPending: isDeleting } = useDeleteStatus();

  // Delete Handling
  const handleOpenDeleteDialog = (status: Status) => {
    setSelectedStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStatus(null);
  };

  const handleDeleteStatus = async () => {
    if (!selectedStatus) return;

    try {
      await deleteStatus(selectedStatus.id);
      setSnackbarSeverity('success');
      setSnackbarMessage('Status deleted successfully!');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting status:', error);

      // Check if this is a constraint violation error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (error && (error as any).response?.data?.error === 'Cannot delete status because it has associated cars') {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Cannot delete status "${selectedStatus.name}" because it's used by existing cars.`);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to delete status. Please try again.');
      }
      handleCloseDeleteDialog();
    }
  };

  // Edit Handling
  const handleOpenEditDialog = (status: Status) => {
    setSelectedStatus(status);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedStatus(null);
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
        field: 'carsCount',
        headerName: 'Cars Using',
        flex: 1,
        renderCell: params => {
          const status = statuses?.find(s => s.id === params.row.id);
          const carsCount = status?.cars?.length || 0;
          return <p>{carsCount}</p>;
        },
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => {
          const status = statuses?.find(s => s.id === params.row.id);
          if (!status) return null;

          return (
            <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
              <Tooltip title='Edit' arrow>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOpenEditDialog(status)}
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
                  onClick={() => handleOpenDeleteDialog(status)}
                  disabled={isDeleting && selectedStatus?.id === status.id}
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
                  {isDeleting && selectedStatus?.id === status.id ? (
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
    [statuses, isDeleting, selectedStatus],
  );

  return (
    <>
      <GridTable
        rows={statuses || []}
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
              Edit Status
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
          {selectedStatus && (
            <StatusForm
              status={selectedStatus}
              isEdit={true}
              onClose={handleCloseEditDialog}
              onSuccess={() => {
                setSnackbarSeverity('success');
                setSnackbarMessage('Status updated successfully!');
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
              Delete Status
            </Typography>
            <IconButton onClick={handleCloseDeleteDialog} sx={{ color: '#A0AEC0' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete the following status?
          </Typography>
          {selectedStatus && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {selectedStatus.name}
              </Typography>
            </Box>
          )}
          <Alert severity='warning' sx={{ mt: 3 }}>
            This action cannot be undone. Any cars associated with this status may be affected.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteStatus}
            variant='contained'
            color='error'
            disabled={isDeleting}
            sx={{
              borderRadius: '8px',
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

export default StatusListTable;
