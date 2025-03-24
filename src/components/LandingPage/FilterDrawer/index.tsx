'use client';
import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Car } from '@/types/car';
import Grid from '@mui/material/Grid2';
import {
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab,
  Badge,
  Skeleton,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import { useBrands } from '@/hooks/useBrand';
import { useColors } from '@/hooks/useColor';
import { useModels } from '@/hooks/useModel';
import { useStatuses } from '@/hooks/useStatus';
import Image from 'next/image';

interface FilterDrawerProps {
  cars: Car[];
  setFilteredCars: React.Dispatch<React.SetStateAction<Car[]>>;
  initialModelId?: string | null;
}

// Define filter types for better type safety
type FilterState = {
  brand: string;
  color: string;
  model: string;
  search: string;
  status: string;
};

// Default filter values
const DEFAULT_FILTERS: FilterState = {
  brand: 'All Brands',
  color: 'All Colors',
  model: 'All Models',
  status: 'All Statuses',
  search: '',
};

const FilterDrawer: React.FC<FilterDrawerProps> = ({ cars, setFilteredCars, initialModelId = null }) => {
  // Theme and responsive detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data fetching with loading states
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colors, isLoading: colorsLoading } = useColors();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { data: statuses, isLoading: statusesLoading } = useStatuses();

  // Consolidated filter state
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });

  // UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [openSelectModelDialog, setOpenSelectModelDialog] = useState(false);
  const [dialogSelectModelShown, setDialogSelectModelShown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle initialModelId
  useEffect(() => {
    if (initialModelId && models?.length) {
      const matchingModel = models.find(model => model.id === initialModelId);
      if (matchingModel) {
        setFilters(prev => ({ ...prev, model: matchingModel.name }));
      }
    }
  }, [initialModelId, models]);

  // Mobile model dialog on first visit
  useEffect(() => {
    if (isMobile && filters.model === 'All Models' && !initialModelId && !dialogSelectModelShown) {
      setOpenSelectModelDialog(true);
      setDialogSelectModelShown(true);
    }
  }, [isMobile, filters.model, initialModelId, dialogSelectModelShown]);

  // Filter handlers with useCallback for better performance
  const handleFilterChange = useCallback((type: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  }, []);

  const handleModelSelect = useCallback(
    (model: string) => {
      handleFilterChange('model', model);
      setOpenSelectModelDialog(false);
    },
    [handleFilterChange],
  );

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  // Dialog handlers
  const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

  // Apply filters with useMemo for performance
  useEffect(() => {
    if (cars.length === 0) return;

    // Apply filters
    const filtered = cars.filter(car => {
      // Search filter
      if (
        filters.search &&
        !(
          car.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.brand?.name?.toLowerCase().includes(filters.search.toLowerCase())
        )
      ) {
        return false;
      }

      // Brand filter
      if (filters.brand !== 'All Brands' && car.brand?.name !== filters.brand) {
        return false;
      }

      // Status filter
      if (filters.status !== 'All Statuses' && car.status?.name !== filters.status) {
        return false;
      }

      // Color filter
      if (filters.color !== 'All Colors' && car.color?.name !== filters.color) {
        return false;
      }

      // Model filter
      if (filters.model !== 'All Models' && car.model?.name !== filters.model) {
        return false;
      }

      return true;
    });

    setFilteredCars(filtered);

    // Count active filters
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      // Skip 'search' if it's empty
      if (key === 'search' && !value) return acc;
      // Count filter if it's not a default value
      return value !== DEFAULT_FILTERS[key as keyof FilterState] ? acc + 1 : acc;
    }, 0);

    setActiveFiltersCount(count);
  }, [filters, cars, setFilteredCars]);

  // Memoize the color palette for better performance
  const colorPalette = useMemo(() => {
    if (colorsLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <Grid size={1.2} key={`color-skeleton-${index}`}>
            <Skeleton variant='circular' height={100} sx={{ mb: 0.5, borderRadius: 1 }} animation='wave' />
          </Grid>
        ));
    }

    return (
      <>
        <Grid size={1.2}>
          <Tooltip title='All Colors'>
            <Box
              onClick={() => handleFilterChange('color', 'All Colors')}
              sx={{
                width: '100%',
                aspectRatio: '1/1',
                background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)',
                borderRadius: '50%',
                margin: '0 auto',
                boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                transform: filters.color === 'All Colors' ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.3)',
                },
              }}
              aria-label='All Colors'
              role='button'
            />
          </Tooltip>
        </Grid>
        {colors?.map(color => (
          <Grid size={1.2} key={color.id}>
            <Tooltip title={color.name}>
              <Box
                onClick={() => handleFilterChange('color', color.name)}
                sx={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: color.rgb ?? 'white',
                  borderRadius: '50%',
                  margin: '0 auto',
                  boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                  transform: filters.color === color.name ? 'scale(1.3)' : 'scale(1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.3)',
                  },
                }}
                aria-label={color.name}
                role='button'
              />
            </Tooltip>
          </Grid>
        ))}
      </>
    );
  }, [colors, colorsLoading, filters.color, handleFilterChange]);

  const statusList = useMemo(() => {
    if (statusesLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={`status-skeleton-${index}`}
            variant='rectangular'
            height={36}
            sx={{ mb: 0.5, borderRadius: 1 }}
            animation='wave'
          />
        ));
    }

    return (
      <>
        <ListItemButton
          key='all-status'
          selected={filters.status === 'All Statuses'}
          onClick={() => handleFilterChange('status', 'All Statuses')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'gray',
              },
            },
          }}>
          <ListItemText
            primary='All'
            primaryTypographyProps={{
              fontWeight: filters.status === 'All Statuses' ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>

        {statuses?.map(status => (
          <ListItemButton
            key={status.id}
            selected={filters.status === status.name}
            onClick={() => handleFilterChange('status', status.name)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'gray',
                },
              },
            }}>
            <ListItemText
              primary={status.name}
              primaryTypographyProps={{
                fontWeight: filters.status === status.name ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </>
    );
  }, [filters.status, handleFilterChange, statuses, statusesLoading]);

  // Memoize the brand list for better performance
  const brandList = useMemo(() => {
    if (brandsLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={`brand-skeleton-${index}`}
            variant='rectangular'
            height={36}
            sx={{ mb: 0.5, borderRadius: 1 }}
            animation='wave'
          />
        ));
    }

    return (
      <>
        <ListItemButton
          key='all-brands'
          selected={filters.brand === 'All Brands'}
          onClick={() => handleFilterChange('brand', 'All Brands')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'gray',
              },
            },
          }}>
          <ListItemText
            primary='All Brands'
            primaryTypographyProps={{
              fontWeight: filters.brand === 'All Brands' ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>

        {brands?.map(brand => (
          <ListItemButton
            key={brand.id}
            selected={filters.brand === brand.name}
            onClick={() => handleFilterChange('brand', brand.name)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'gray',
                },
              },
            }}>
            <ListItemText
              primary={brand.name}
              primaryTypographyProps={{
                fontWeight: filters.brand === brand.name ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </>
    );
  }, [brands, brandsLoading, filters.brand, handleFilterChange]);

  // Memoize the model grid for better performance
  const modelGrid = useMemo(() => {
    if (modelsLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={`model-skeleton-${index}`}
            variant='rounded'
            height={36}
            sx={{ mb: 0.5, borderRadius: 1 }}
            animation='wave'
          />
        ));
    }

    return (
      <>
        <Grid
          size={4}
          onClick={() => handleModelSelect('All Models')}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: '1/1',
            boxShadow:
              filters.model === 'All Models' ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
            borderRadius: filters.model === 'All Models' ? '8px' : '0px',
            transform: 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          role='button'
          aria-pressed={filters.model === 'All Models'}>
          <Typography>All Models</Typography>
        </Grid>

        {models?.map(model => (
          <Grid
            key={model.id}
            size={4}
            onClick={() => handleModelSelect(model.name)}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: '1/1',
              boxShadow:
                filters.model === model.name ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
              borderRadius: filters.model === model.name ? '8px' : '0px',
              transform: 'scale(1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            role='button'
            aria-pressed={filters.model === model.name}>
            {model.imageUrl ? (
              <Image
                unoptimized
                src={model.imageUrl}
                alt={model.name}
                fill
                style={{ objectFit: 'contain' }}
                sizes='(max-width: 768px) 100vw, 33vw'
              />
            ) : (
              <Typography sx={{ textAlign: 'center' }}>{model.name}</Typography>
            )}
          </Grid>
        ))}
      </>
    );
  }, [models, modelsLoading, filters.model, handleModelSelect]);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.color !== 'All Colors') {
      chips.push(
        <Chip
          key='color-chip'
          label={filters.color}
          variant='filled'
          onDelete={() => handleFilterChange('color', 'All Colors')}
        />,
      );
    }

    if (filters.brand !== 'All Brands') {
      chips.push(
        <Chip
          key='brand-chip'
          label={filters.brand}
          variant='filled'
          onDelete={() => handleFilterChange('brand', 'All Brands')}
        />,
      );
    }

    if (filters.model !== 'All Models') {
      chips.push(
        <Chip
          key='model-chip'
          label={filters.model}
          variant='filled'
          onDelete={() => handleFilterChange('model', 'All Models')}
        />,
      );
    }

    return chips.length > 0 ? (
      <Stack direction='row' spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2 }}>
        {chips}
      </Stack>
    ) : null;
  }, [filters, handleFilterChange]);

  // Main filter content
  const filterContent = useMemo(
    () => (
      <Box>
        {!isMobile && (
          <Typography variant='h6' fontWeight='bold' component='div' gutterBottom>
            Filters
          </Typography>
        )}

        {activeFilterChips}

        {/* Search Box */}
        <TextField
          fullWidth
          placeholder='Search cars...'
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
          variant='outlined'
          size='small'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Color Filter */}
        <Divider sx={{ my: 1, mb: 1 }} />
        <Typography variant='subtitle1' fontWeight='bold' component='div' sx={{ mb: 1 }}>
          Color
        </Typography>
        <Grid container spacing={1}>
          {colorPalette}
        </Grid>

        {/* Status Filter  */}
        <Divider sx={{ my: 1, mb: 1 }} />
        <Typography variant='subtitle1' fontWeight='bold' component='div'>
          Stock Status
        </Typography>
        <List dense sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {statusList}
        </List>

        {/* Brand Filter */}
        <Divider sx={{ my: 1, mb: 1 }} />
        <Typography variant='subtitle1' fontWeight='bold' component='div'>
          Brand
        </Typography>
        <List dense sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {brandList}
        </List>

        {/* Model Filter */}
        <Divider sx={{ my: 1, mt: 2, mb: 1 }} />
        <Typography variant='subtitle1' fontWeight='bold' component='div'>
          Models
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2, mt: 1 }}>
          {modelGrid}
        </Grid>

        {/* Action Buttons */}
        {isMobile && (
          <Button
            variant='contained'
            fullWidth
            onClick={handleCloseDialog}
            sx={{ mt: 2, mb: 2, background: '#4164DF', borderRadius: 0 }}>
            Apply Filters
          </Button>
        )}

        <Button
          variant='contained'
          fullWidth
          onClick={resetFilters}
          sx={{ mb: isMobile ? 2 : 0, background: 'gray', borderRadius: 0 }}>
          Reset All Filters
        </Button>
      </Box>
    ),
    [
      isMobile,
      activeFilterChips,
      filters.search,
      colorPalette,
      statusList,
      brandList,
      modelGrid,
      handleCloseDialog,
      resetFilters,
      handleFilterChange,
    ],
  );

  // Loading state during SSR
  if (!isClient) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant='rectangular' height={400} animation='wave' />
      </Box>
    );
  }

  return (
    <>
      {/* Desktop Layout */}
      {!isMobile && filterContent}

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 1000,
          }}>
          <Fab
            color='primary'
            aria-label='filter'
            onClick={handleOpenDialog}
            sx={{ boxShadow: '0 4px 10px rgba(0,0,0,0.2)', background: 'black' }}>
            <Badge
              badgeContent={activeFiltersCount}
              color='error'
              sx={{
                '.MuiBadge-badge': {
                  top: 5,
                  right: 5,
                },
              }}>
              <FilterAltIcon sx={{ background: 'black' }} />
            </Badge>
          </Fab>
        </Box>
      )}

      {/* Mobile Filter Dialog */}
      {isMobile && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='xs' aria-labelledby='filter-dialog-title'>
          <DialogTitle
            id='filter-dialog-title'
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0, px: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              Filter
            </Typography>
            <IconButton edge='end' color='inherit' onClick={handleCloseDialog} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>{filterContent}</DialogContent>
        </Dialog>
      )}

      {/* Mobile Model Selection Dialog */}
      {isMobile && models && (
        <Dialog
          open={openSelectModelDialog}
          onClose={() => setOpenSelectModelDialog(false)}
          fullScreen
          sx={{ maxWidth: '82%', height: '75%', margin: 'auto' }}
          aria-labelledby='select-model-dialog-title'>
          <DialogTitle
            id='select-model-dialog-title'
            sx={{ p: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Select Model Collection</Typography>
            <IconButton
              onClick={() => setOpenSelectModelDialog(false)}
              aria-label='close'
              sx={{
                zIndex: 1,
                color: 'black',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Grid container spacing={1} sx={{ padding: 2 }}>
              {modelGrid}
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FilterDrawer;
