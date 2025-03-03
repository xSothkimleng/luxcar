'use client';
import React, { JSX } from 'react';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, useTheme, Typography, Paper, CircularProgress, Stack, Fade, alpha } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomDataGridProps<T extends Record<string, any>> = {
  rows: T[];
  columns: GridColDef<T>[];
  loading: boolean;
  filterSection?: JSX.Element;
  emptyMessage?: string;
  hideToolbar?: boolean;
  showExport?: boolean;
  [key: string]: unknown;
};

const DefaultToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
    <Box>
      <GridToolbarQuickFilter
        debounceMs={500}
        sx={{
          width: 250,
          '& .MuiInputBase-root': {
            borderRadius: '8px',
            backgroundColor: theme => alpha(theme.palette.background.paper, 0.7),
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s',
            '&:hover, &:focus-within': {
              backgroundColor: theme => theme.palette.background.paper,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
          },
        }}
      />
    </Box>
  </GridToolbarContainer>
);

const CustomNoRowsOverlay: React.FC<{ message?: string }> = ({ message = 'No Data Available' }) => {
  const theme = useTheme();
  return (
    <Fade in={true} timeout={800}>
      <Stack
        spacing={2}
        direction='column'
        alignItems='center'
        justifyContent='center'
        sx={{
          height: '100%',
          p: 3,
          m: 2,
          minHeight: 200,
          borderRadius: '16px',
          backgroundColor: theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.background.paper, 0.2),
        }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.6) }} />
        <Typography variant='h6' color='text.secondary' sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Stack>
    </Fade>
  );
};

const CustomLoadingOverlay: React.FC = () => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <CircularProgress
      size={40}
      thickness={4}
      sx={{
        color: '#605BFF',
      }}
    />
    <Typography variant='body2' sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
      Loading data...
    </Typography>
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridTable = <T extends Record<string, any>>({
  rows,
  columns,
  loading,
  filterSection,
  emptyMessage,
  hideToolbar = false,
  ...props
}: CustomDataGridProps<T>) => {
  const ToolbarComponent = filterSection ? () => filterSection : hideToolbar ? null : () => <DefaultToolbar />;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 0,
        backgroundColor: 'transparent',
      }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        slots={{
          toolbar: ToolbarComponent,
          loadingOverlay: CustomLoadingOverlay,
          noRowsOverlay: () => <CustomNoRowsOverlay message={emptyMessage} />,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [''],
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        sx={{
          border: 'none',
          height: '100%',
          width: '100%',
          // Base styling
          '& .MuiDataGrid-root': {
            border: 'none',
            borderRadius: 0,
          },
          // Cell styling
          '& .MuiDataGrid-cell': {
            fontSize: '0.875rem',
            borderBottom: '1px solid',
            borderColor: '#EDF2F7',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          // Header styling
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #EDF2F7',
            borderRadius: 0,
            '& .MuiDataGrid-columnHeader': {
              '&:focus': {
                outline: 'none',
              },
              '&:focus-within': {
                outline: 'none',
              },
            },
          },
          // Column header text
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color: '#2D3748',
            fontSize: '0.875rem',
          },
          // Hide column separators
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          // Row styling
          '& .MuiDataGrid-row': {
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(96, 91, 255, 0.04)',
            },
            '&:nth-of-type(even)': {
              backgroundColor: '#FAFBFF',
            },
          },
          // Last row styling
          '& .MuiDataGrid-row:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
          },
          // Footer styling
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #EDF2F7',
            backgroundColor: '#F8FAFC',
          },
          // Pagination styling
          '& .MuiTablePagination-root': {
            color: '#718096',
          },
          // Scrollbar styling
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          },
          // Apply any custom styles passed in props
          ...(props.sx || {}),
        }}
        {...props}
      />
    </Paper>
  );
};

export default GridTable;
