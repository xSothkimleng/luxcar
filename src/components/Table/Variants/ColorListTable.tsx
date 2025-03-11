import * as React from 'react';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Snackbar, Alert, Tooltip, Zoom } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GridTable from '@/components/Table';
import { useColors } from '@/hooks/useColor';

const ColorListTable = () => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const { data: colors, isLoading } = useColors();

  const handleDeleteCar = (id: string) => {
    console.log('Deleting car with id:', id);
    setSnackbarSeverity('success');
    setSnackbarMessage('Toy car deleted successfully!');
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => (
          <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
            <Tooltip title='Edit' arrow>
              <Button
                variant='contained'
                size='small'
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
                onClick={() => handleDeleteCar(params.row.id)}
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
                <DeleteOutlineIcon fontSize='small' />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <GridTable
        rows={colors || []}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'dateAdded', sort: 'desc' }] },
        }}
      />
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

export default ColorListTable;
