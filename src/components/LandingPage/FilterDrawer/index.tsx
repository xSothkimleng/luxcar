'use client';
import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
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
import { PaginatedCarsParams } from '@/hooks/usePaginatedCars';

interface FilterDrawerProps {
  onFilterChange: (filters: Partial<PaginatedCarsParams>) => void;
  initialFilters?: Partial<PaginatedCarsParams>;
  initialModelId?: string | null;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ onFilterChange, initialFilters = {}, initialModelId = null }) => {
  // Theme and responsive detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data fetching with loading states
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colors, isLoading: colorsLoading } = useColors();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { data: statuses, isLoading: statusesLoading } = useStatuses();

  // UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [openSelectModelDialog, setOpenSelectModelDialog] = useState(false);
  const [dialogSelectModelShown, setDialogSelectModelShown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Filter states
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialFilters.brandId);
  const [selectedColorId, setSelectedColorId] = useState<string | undefined>(initialFilters.colorId);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    initialFilters.modelId || initialModelId || undefined,
  );
  const [selectedStatusId, setSelectedStatusId] = useState<string | undefined>(initialFilters.statusId);
  const [searchTerm, setSearchTerm] = useState<string>(initialFilters.search || '');

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize filters from props
  useEffect(() => {
    if (initialModelId && models?.length) {
      const matchingModel = models.find(model => model.id === initialModelId);
      if (matchingModel) {
        setSelectedModelId(matchingModel.id);
        applyFilters({
          modelId: matchingModel.id,
        });
      }
    }
  }, [initialModelId, models]);

  // Mobile model dialog on first visit
  useEffect(() => {
    if (isMobile && !selectedModelId && !initialModelId && !dialogSelectModelShown) {
      setOpenSelectModelDialog(true);
      setDialogSelectModelShown(true);
    }
  }, [isMobile, selectedModelId, initialModelId, dialogSelectModelShown]);

  // Apply filters function
  const applyFilters = useCallback(
    (changedFilters: Partial<PaginatedCarsParams>) => {
      const newFilters: Partial<PaginatedCarsParams> = {
        brandId: selectedBrandId,
        colorId: selectedColorId,
        modelId: selectedModelId,
        statusId: selectedStatusId,
        search: searchTerm,
        ...changedFilters,
      };

      // Count active filters
      const count = Object.entries(newFilters).reduce((acc, [key, value]) => {
        // Skip 'page', 'limit', 'sort', 'order'
        if (['page', 'limit', 'sort', 'order'].includes(key)) return acc;

        // Count filter if it has a value
        return value ? acc + 1 : acc;
      }, 0);

      setActiveFiltersCount(count);

      // Call the parent component's filter handler
      onFilterChange(newFilters);
    },
    [selectedBrandId, selectedColorId, selectedModelId, selectedStatusId, searchTerm, onFilterChange],
  );

  // Filter handlers - wrap each in useCallback
  const handleBrandSelect = useCallback(
    (brandId: string | undefined) => {
      setSelectedBrandId(brandId);
      applyFilters({ brandId });
    },
    [applyFilters],
  );

  const handleColorSelect = useCallback(
    (colorId: string | undefined) => {
      setSelectedColorId(colorId);
      applyFilters({ colorId });
    },
    [applyFilters],
  );

  const handleModelSelect = useCallback(
    (modelId: string | undefined) => {
      setSelectedModelId(modelId);
      applyFilters({ modelId });
      setOpenSelectModelDialog(false);
    },
    [applyFilters],
  );

  const handleStatusSelect = useCallback(
    (statusId: string | undefined) => {
      setSelectedStatusId(statusId);
      applyFilters({ statusId });
    },
    [applyFilters],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      applyFilters({ search: e.target.value });
    },
    [applyFilters],
  );

  const resetFilters = useCallback(() => {
    setSelectedBrandId(undefined);
    setSelectedColorId(undefined);
    setSelectedModelId(undefined);
    setSelectedStatusId(undefined);
    setSearchTerm('');
    applyFilters({
      brandId: undefined,
      colorId: undefined,
      modelId: undefined,
      statusId: undefined,
      search: '',
    });
  }, [applyFilters]);

  // Dialog handlers
  const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

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
              onClick={() => handleColorSelect(undefined)}
              sx={{
                width: '100%',
                aspectRatio: '1/1',
                background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)',
                borderRadius: '50%',
                margin: '0 auto',
                boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                transform: !selectedColorId ? 'scale(1.3)' : 'scale(1)',
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
                onClick={() => handleColorSelect(color.id)}
                sx={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: color.rgb ?? 'white',
                  borderRadius: '50%',
                  margin: '0 auto',
                  boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                  transform: selectedColorId === color.id ? 'scale(1.3)' : 'scale(1)',
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
  }, [colors, colorsLoading, selectedColorId, handleColorSelect]);

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
          selected={!selectedStatusId}
          onClick={() => handleStatusSelect(undefined)}
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
              fontWeight: !selectedStatusId ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>

        {statuses?.map(status => (
          <ListItemButton
            key={status.id}
            selected={selectedStatusId === status.id}
            onClick={() => handleStatusSelect(status.id)}
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
                fontWeight: selectedStatusId === status.id ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </>
    );
  }, [statuses, statusesLoading, selectedStatusId, handleStatusSelect]);

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
          selected={!selectedBrandId}
          onClick={() => handleBrandSelect(undefined)}
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
              fontWeight: !selectedBrandId ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>

        {brands?.map(brand => (
          <ListItemButton
            key={brand.id}
            selected={selectedBrandId === brand.id}
            onClick={() => handleBrandSelect(brand.id)}
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
                fontWeight: selectedBrandId === brand.id ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </>
    );
  }, [brands, brandsLoading, selectedBrandId, handleBrandSelect]);

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
          onClick={() => handleModelSelect(undefined)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: '1/1',
            boxShadow: !selectedModelId ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
            borderRadius: !selectedModelId ? '8px' : '0px',
            transform: 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          role='button'
          aria-pressed={!selectedModelId}>
          <Typography>All Models</Typography>
        </Grid>

        {models?.map(model => (
          <Grid
            key={model.id}
            size={4}
            onClick={() => handleModelSelect(model.id)}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: '1/1',
              boxShadow:
                selectedModelId === model.id ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
              borderRadius: selectedModelId === model.id ? '8px' : '0px',
              transform: 'scale(1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            role='button'
            aria-pressed={selectedModelId === model.id}>
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
  }, [models, modelsLoading, selectedModelId, handleModelSelect]);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];

    // Color chip
    if (selectedColorId) {
      const selectedColor = colors?.find(c => c.id === selectedColorId);
      if (selectedColor) {
        chips.push(
          <Chip
            key='color-chip'
            label={selectedColor.name}
            variant='filled'
            sx={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
            }}
            avatar={
              <Box
                component='span'
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: selectedColor.rgb,
                }}
              />
            }
            onDelete={() => handleColorSelect(undefined)}
          />,
        );
      }
    }

    // Brand chip
    if (selectedBrandId) {
      const selectedBrand = brands?.find(b => b.id === selectedBrandId);
      if (selectedBrand) {
        chips.push(
          <Chip
            key='brand-chip'
            label={selectedBrand.name}
            variant='filled'
            sx={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
            }}
            onDelete={() => handleBrandSelect(undefined)}
          />,
        );
      }
    }

    // Model chip
    if (selectedModelId) {
      const selectedModel = models?.find(m => m.id === selectedModelId);
      if (selectedModel) {
        chips.push(
          <Chip
            key='model-chip'
            label={selectedModel.name}
            variant='filled'
            sx={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
            }}
            onDelete={() => handleModelSelect(undefined)}
          />,
        );
      }
    }

    // Status chip
    if (selectedStatusId) {
      const selectedStatus = statuses?.find(s => s.id === selectedStatusId);
      if (selectedStatus) {
        chips.push(
          <Chip
            key='status-chip'
            label={selectedStatus.name}
            variant='filled'
            sx={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
            }}
            onDelete={() => handleStatusSelect(undefined)}
          />,
        );
      }
    }

    // Search term chip
    if (searchTerm) {
      chips.push(
        <Chip
          key='search-chip'
          label={`Search: ${searchTerm}`}
          variant='filled'
          sx={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
          }}
          onDelete={() => {
            setSearchTerm('');
            applyFilters({ search: '' });
          }}
        />,
      );
    }

    return chips.length > 0 ? (
      <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap' sx={{ mb: 2 }}>
        {chips}
      </Stack>
    ) : null;
  }, [
    selectedColorId,
    selectedBrandId,
    selectedModelId,
    selectedStatusId,
    searchTerm,
    colors,
    brands,
    models,
    statuses,
    handleColorSelect,
    handleBrandSelect,
    handleModelSelect,
    handleStatusSelect,
    applyFilters,
  ]);

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
          value={searchTerm}
          onChange={handleSearchChange}
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
      searchTerm,
      colorPalette,
      statusList,
      brandList,
      modelGrid,
      handleCloseDialog,
      resetFilters,
      handleSearchChange,
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
