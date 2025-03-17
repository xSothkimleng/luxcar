'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useBrands } from '@/hooks/useBrand';
import { useColors } from '@/hooks/useColor';
import { useModels } from '@/hooks/useModel';
import Image from 'next/image';

interface FilterDrawerProps {
  cars: Car[];
  setFilteredCars: React.Dispatch<React.SetStateAction<Car[]>>;
  initialModelId?: string | null; // Add this prop
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ cars, setFilteredCars, initialModelId = null }) => {
  // Always use useTheme and useMediaQuery together on client-side
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data fetching with loading states
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colors, isLoading: colorsLoading } = useColors();
  const { data: models, isLoading: modelsLoading } = useModels();

  // States - All initialized safely for SSR
  const [openDialog, setOpenDialog] = useState(false);
  const [openSelectModelDialog, setOpenSelectModelDialog] = useState(false);
  const [dialogSelectModelShown, setDialogSelectModelShown] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedColor, setSelectedColor] = useState('All Colors');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  // Flag to indicate client-side hydration is complete
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setOpenSelectModelDialog(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All Brands');
    setSelectedColor('All Colors');
    setSelectedModel('All Models');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Fix the model selection issue
  useEffect(() => {
    if (selectedModel === 'All Brands') {
      setSelectedModel('All Models');
    }
  }, [selectedModel]);

  // Fix the color selection issue
  useEffect(() => {
    if (selectedColor === 'All Brands') {
      setSelectedColor('All Colors');
    }
  }, [selectedColor]);

  useEffect(() => {
    if (initialModelId && models?.length) {
      // Find the model with matching ID
      const matchingModel = models.find(model => model.id === initialModelId);
      if (matchingModel) {
        setSelectedModel(matchingModel.name);
      }
    }
  }, [initialModelId, models]);

  useEffect(() => {
    if (cars.length === 0) return;

    // Apply filters when any filter changes
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        car =>
          car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by brand
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(car => car.brand?.name === selectedBrand);
    }

    // Filter by color
    if (selectedColor !== 'All Colors') {
      filtered = filtered.filter(car => car.color?.name === selectedColor);
    }

    // Filter by model
    if (selectedModel !== 'All Models') {
      filtered = filtered.filter(car => car.model?.name === selectedModel);
    }

    setFilteredCars(filtered);

    // Count active filters
    let count = 0;
    if (searchQuery) count++;
    if (selectedBrand !== 'All Brands') count++;
    if (selectedColor !== 'All Colors') count++;
    if (selectedModel !== 'All Models') count++;
    setActiveFiltersCount(count);
  }, [searchQuery, selectedBrand, selectedColor, selectedModel, cars, setFilteredCars]);

  useEffect(() => {
    // Only open dialog if we're on mobile, no model is selected,
    // no initialModelId, and dialog hasn't been shown yet
    if (isMobile && selectedModel === 'All Models' && !initialModelId && !dialogSelectModelShown) {
      setOpenSelectModelDialog(true);
      setDialogSelectModelShown(true); // Mark dialog as shown
    }
  }, [isMobile, selectedModel, initialModelId, dialogSelectModelShown]);

  // Filter content that will be used in both desktop and mobile views
  const filterContent = (
    <Box>
      {!isMobile && (
        <>
          <Typography variant='h6' fontWeight='bold' component='div' gutterBottom>
            Filters
          </Typography>
        </>
      )}

      <Box
        sx={{
          mb: 2,
        }}>
        <Stack direction={'row'} spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {selectedColor != 'All Colors' && (
            <Chip label={selectedColor} variant='filled' onDelete={() => setSelectedColor('All Colors')} />
          )}
          {selectedBrand != 'All Brands' && (
            <Chip label={selectedBrand} variant='filled' onDelete={() => setSelectedBrand('All Brands')} />
          )}
          {selectedModel != 'All Models' && (
            <Chip label={selectedModel} variant='filled' onDelete={() => setSelectedModel('All Models')} />
          )}
        </Stack>
      </Box>

      {/* Search Box */}
      <TextField
        fullWidth
        placeholder='Search cars...'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
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
        {colorsLoading
          ? // Skeleton loaders for colors
            Array(5)
              .fill(0)
              .map((_, index) => (
                <Grid size={1.2} key={`color-skeleton-${index}`}>
                  <Skeleton variant='circular' height={100} sx={{ mb: 0.5, borderRadius: 1 }} animation='wave' />
                </Grid>
              ))
          : colors && (
              <>
                <Grid size={1.2}>
                  <Box
                    onClick={() => handleColorSelect('All Colors')}
                    sx={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)',
                      borderRadius: '50%',
                      margin: '0 auto',
                      boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                      transform: selectedColor === 'All Colors' ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.3)',
                      },
                    }}
                  />
                </Grid>
                {colors.map(color => (
                  <Grid size={1.2} key={color.id}>
                    <Box
                      onClick={() => handleColorSelect(color.name)}
                      sx={{
                        width: '100%',
                        aspectRatio: '1/1',
                        background: color.rgb ?? 'white',
                        borderRadius: '50%',
                        margin: '0 auto',
                        boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                        transform: selectedColor === color.name ? 'scale(1.3)' : 'scale(1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.3)',
                        },
                      }}
                    />
                  </Grid>
                ))}
              </>
            )}
      </Grid>

      {/* Brand Filter */}
      <Divider sx={{ my: 1, mb: 1 }} />
      <Typography variant='subtitle1' fontWeight='bold' component='div'>
        Brand
      </Typography>
      <List dense sx={{ maxHeight: '300px', overflowY: 'auto' }}>
        <ListItemButton
          key='all-brands'
          selected={selectedBrand === 'All Brands'}
          onClick={() => handleBrandSelect('All Brands')}
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
              fontWeight: selectedBrand === 'All Brands' ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>

        {brandsLoading
          ? // Skeleton loaders for brands
            Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={`brand-skeleton-${index}`}
                  variant='rectangular'
                  height={36}
                  sx={{ mb: 0.5, borderRadius: 1 }}
                  animation='wave'
                />
              ))
          : brands &&
            brands.map(brand => (
              <ListItemButton
                key={brand.id}
                selected={selectedBrand === brand.name}
                onClick={() => handleBrandSelect(brand.name)}
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
                    fontWeight: selectedBrand === brand.name ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            ))}
      </List>

      {/* Model Filter */}
      <Divider sx={{ my: 1, mt: 2, mb: 1 }} />
      <Typography variant='subtitle1' fontWeight='bold' component='div'>
        Models
      </Typography>
      <Grid container spacing={1} sx={{ mb: 2, mt: 1 }}>
        <Grid
          size={4}
          onClick={() => handleModelSelect('All Models')}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: '1/1',
            boxShadow:
              selectedModel == 'All Models' ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
            borderRadius: selectedModel == 'All Models' ? '8px' : '0px',
            transform: 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}>
          <Typography>All Models</Typography>
        </Grid>

        {modelsLoading
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={`model-skeleton-${index}`}
                  variant='rounded'
                  height={36}
                  sx={{ mb: 0.5, borderRadius: 1 }}
                  animation='wave'
                />
              ))
          : models &&
            models.map(model => (
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
                    selectedModel == model.name ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px' : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                  borderRadius: selectedModel == model.name ? '8px' : '0px',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}>
                {model.imageUrl ? (
                  <Image src={model.imageUrl} alt={model.name} fill style={{ objectFit: 'contain' }} />
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>{model.name}</Typography>
                )}
              </Grid>
            ))}
      </Grid>

      {isMobile && (
        <Button
          variant='contained'
          fullWidth
          onClick={handleCloseDialog}
          sx={{ mt: 2, mb: 2, background: '#4164DF', borderRadius: 0 }}>
          Apply Filters
        </Button>
      )}
      {/* Action Buttons */}
      <Button
        variant='contained'
        fullWidth
        onClick={resetFilters}
        sx={{ mb: isMobile ? 2 : 0, background: 'gray', borderRadius: 0 }}>
        Reset All Filters
      </Button>
    </Box>
  );

  // Only render client components after hydration
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

      {/* Mobile Filter Button - Only render on client */}
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

      {/* Mobile Filter Dialog - Only used on client */}
      {isMobile && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='xs'>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0, px: 2 }}>
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

      {/* display brand categories when loaded in */}
      {isMobile && brands && (
        <Dialog
          open={openSelectModelDialog}
          onClose={() => setOpenSelectModelDialog(false)}
          fullScreen
          sx={{ maxWidth: '82%', height: '75%', margin: 'auto' }}>
          <DialogTitle sx={{ p: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Select Model Collection</Typography>
            <IconButton
              onClick={() => setOpenSelectModelDialog(false)}
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
              <Grid
                size={4}
                onClick={() => handleModelSelect('All Models')}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1/1',

                  boxShadow:
                    selectedModel == 'All Models'
                      ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px'
                      : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                  borderRadius: selectedModel == 'All Models' ? '8px' : '0px',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}>
                <Typography>All Models</Typography>
              </Grid>

              {modelsLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        key={`model-skeleton-${index}`}
                        variant='rounded'
                        height={36}
                        sx={{ mb: 0.5, borderRadius: 1 }}
                        animation='wave'
                      />
                    ))
                : models &&
                  models.map(model => (
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
                          selectedModel == model.name
                            ? 'rgba(99, 99, 99, 0.4) 0px 2px 8px 0px'
                            : 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                        borderRadius: selectedModel == model.name ? '8px' : '0px',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}>
                      {model.imageUrl ? (
                        <Image src={model.imageUrl} alt={model.name} fill style={{ objectFit: 'contain' }} />
                      ) : (
                        <Typography sx={{ textAlign: 'center' }}>{model.name}</Typography>
                      )}
                    </Grid>
                  ))}
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FilterDrawer;
