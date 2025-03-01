'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Button,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  Chip,
  InputAdornment,
  TextField,
  Badge,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CarDetail from '@/components/CarDetail';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define the Car type
interface Car {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  images: string[];
  featured?: boolean;
  brand?: string;
  type?: string;
}

// Create dummy car data
const dummyCars: Car[] = [
  {
    id: '1',
    name: 'Tesla Model S',
    price: 89999.99,
    color: 'Red',
    description:
      '<p>The <strong>Tesla Model S</strong> is an all-electric five-door liftback sedan produced by Tesla, Inc. The Model S features a dual-motor all-wheel drive setup and can accelerate from 0-60 mph in just 2.3 seconds.</p><p>This model includes:</p><ul><li>Autopilot functionality</li><li>17-inch touchscreen display</li><li>Wireless charging</li><li>Premium audio system</li></ul>',
    images: [
      '/assets/images/sampleCar.jpg',
      '/assets/images/sampleCar2.jpg',
      '/assets/images/sampleCar3.jpg',
      '/assets/images/sampleCar4.jpg',
    ],
    featured: true,
    brand: 'Tesla',
    type: 'Electric',
  },
  {
    id: '2',
    name: 'BMW 5 Series',
    price: 62999.99,
    color: 'Blue',
    description:
      '<p>The <strong>BMW 5 Series</strong> is a luxury sedan that combines elegant styling with advanced technology and driving dynamics. This car offers a perfect balance of comfort, performance, and efficiency.</p><p>Key features:</p><ul><li>10.25-inch touchscreen infotainment system</li><li>Leather upholstery</li><li>Ambient interior lighting</li><li>Advanced driver assistance systems</li></ul>',
    images: [
      '/assets/images/sampleCar.jpg',
      '/assets/images/sampleCar2.jpg',
      '/assets/images/sampleCar3.jpg',
      '/assets/images/sampleCar4.jpg',
    ],
    featured: true,
    brand: 'BMW',
    type: 'Luxury',
  },
  {
    id: '3',
    name: 'Mercedes-Benz E-Class',
    price: 65499.99,
    color: 'Black',
    description:
      '<p>The <strong>Mercedes-Benz E-Class</strong> represents the pinnacle of luxury and refinement in the mid-size sedan segment. With its elegant design and cutting-edge technology, it delivers an exceptional driving experience.</p><p>Highlights include:</p><ul><li>MBUX infotainment system</li><li>Premium Burmester sound system</li><li>64-color ambient lighting</li><li>Air Body Control suspension</li></ul>',
    images: [
      '/assets/images/sampleCar.jpg',
      '/assets/images/sampleCar2.jpg',
      '/assets/images/sampleCar3.jpg',
      '/assets/images/sampleCar4.jpg',
    ],
    featured: true,
    brand: 'Mercedes-Benz',
    type: 'Luxury',
  },
  {
    id: '4',
    name: 'Audi A6',
    price: 58999.99,
    color: 'Silver',
    description:
      '<p>The <strong>Audi A6</strong> is a sophisticated executive sedan with cutting-edge technology and a refined interior. The car offers a smooth ride with powerful performance options.</p><p>Features include:</p><ul><li>Dual touchscreen MMI system</li><li>Virtual Cockpit Plus</li><li>Bang & Olufsen 3D Premium Sound System</li><li>Quattro all-wheel drive</li></ul>',
    images: [
      '/assets/images/sampleCar.jpg',
      '/assets/images/sampleCar2.jpg',
      '/assets/images/sampleCar3.jpg',
      '/assets/images/sampleCar4.jpg',
    ],
    featured: true,
    brand: 'Audi',
    type: 'Luxury',
  },
  {
    id: '5',
    name: 'Toyota Camry Hybrid',
    price: 32999.99,
    color: 'White',
    description:
      '<p>The <strong>Toyota Camry Hybrid</strong> combines efficiency and reliability with a comfortable ride. This fuel-efficient sedan is perfect for daily commuting while reducing your carbon footprint.</p><p>Key specifications:</p><ul><li>2.5L 4-cylinder hybrid engine</li><li>8-inch touchscreen</li><li>Apple CarPlay and Android Auto</li><li>Toyota Safety Sense 2.5+</li></ul>',
    images: [
      '/assets/images/sampleCar.jpg',
      '/assets/images/sampleCar2.jpg',
      '/assets/images/sampleCar3.jpg',
      '/assets/images/sampleCar4.jpg',
    ],
    brand: 'Toyota',
    type: 'Hybrid',
  },
];

// Car brands for filter
const carBrands = [
  'All Brands',
  'Tesla',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Toyota',
  'Honda',
  'Lexus',
  'Ford',
  'Chevrolet',
  'Porsche',
];
const carTypes = ['All Types', 'Luxury', 'Sports', 'Sedan', 'Electric', 'Hybrid'];

const LandingPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cars, setCars] = useState<Car[]>(dummyCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(dummyCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 120000]);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  // Get the min and max price from the car data
  const minPrice = Math.min(...cars.map(car => car.price));
  const maxPrice = Math.max(...cars.map(car => car.price));

  useEffect(() => {
    // Apply filters when any filter changes
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        car =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by price range
    filtered = filtered.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);

    // Filter by brand
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    // Filter by type
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(car => car.type === selectedType);
    }

    setFilteredCars(filtered);
  }, [searchQuery, priceRange, selectedBrand, selectedType, cars]);

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setOpenDialog(true);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  // Color chip for the product cards
  const renderColorChip = (color: string) => {
    const colorMap: Record<string, string> = {
      black: '#000000',
      white: '#FFFFFF',
      silver: '#C0C0C0',
      gray: '#808080',
      red: '#FF0000',
      blue: '#0000FF',
      green: '#008000',
      yellow: '#FFFF00',
      orange: '#FFA500',
      purple: '#800080',
      brown: '#A52A2A',
      gold: '#FFD700',
    };

    const bgColor = colorMap[color.toLowerCase()] || '#CCCCCC';
    const textColor = ['white', 'yellow', 'silver', 'gold'].includes(color.toLowerCase()) ? '#000000' : '#FFFFFF';

    return (
      <Chip
        label={color}
        size='small'
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          fontWeight: 'medium',
        }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Navbar */}
      <AppBar position='sticky' sx={{ backgroundColor: '#000000' }}>
        <Toolbar>
          <Box
            component='div'
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer',
            }}>
            <DirectionsCarIcon sx={{ mr: 1, fontSize: 36, color: '#ffd700' }} />
            <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
              LUX CARS
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button color='inherit' sx={{ fontWeight: 'bold' }}>
              Home
            </Button>
            <Button color='inherit'>Collection</Button>
            <Button color='inherit'>Shop</Button>
            <Button color='inherit'>Contact</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color='inherit'>
              <Badge badgeContent={3} color='error'>
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
            <IconButton color='inherit'>
              <CompareArrowsIcon />
            </IconButton>
            <IconButton color='inherit'>
              <Badge badgeContent={2} color='error'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Promotional Banner */}
      <Box
        sx={{
          bgcolor: '#cc0000',
          color: 'white',
          textAlign: 'center',
          py: 1,
          fontWeight: 'bold',
        }}>
        Special Offer: Get 25% Off on Selected Luxury Models | Limited Time Offer
      </Box>

      {/* Hero Carousel */}
      <Box sx={{ mt: 0 }}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          modules={[Navigation, Pagination, Autoplay]}
          style={{ height: '500px' }}>
          {cars
            .filter(car => car.featured)
            .map((car, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '500px',
                    bgcolor: '#111',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.6,
                      backgroundImage: `/assets/images/sampleCar.jpg`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Container>
                    <Grid container alignItems='center'>
                      <Grid item xs={12} md={6} sx={{ zIndex: 2, p: 4 }}>
                        <Typography variant='h3' color='white' fontWeight='bold' gutterBottom>
                          {car.name}
                        </Typography>
                        <Typography variant='h5' color='white' sx={{ mb: 2 }}>
                          Starting at ${car.price.toLocaleString('en-US')}
                        </Typography>
                        <Button
                          variant='contained'
                          size='large'
                          onClick={() => handleViewCar(car)}
                          sx={{
                            bgcolor: '#ffd700',
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: '#e5c100',
                            },
                          }}>
                          Explore Now
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ zIndex: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '400px',
                          }}>
                          <Box
                            component='div'
                            sx={{
                              width: '100%',
                              height: '70%',
                              position: 'relative',
                              border: '8px solid rgba(255,255,255,0.1)',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            }}>
                            {/* Placeholder for car image */}
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                borderRadius: '8px',
                              }}>
                              <Image src={car.images[0]} alt={car.name} layout='fill' objectFit='cover' quality={100} />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>

      {/* Filter and Products Section */}
      <Container maxWidth='xl' sx={{ my: 4 }}>
        <Grid container spacing={3}>
          {/* Search & Filter Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    placeholder='Search for cars...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Brand: ${selectedBrand}`}
                      onDelete={selectedBrand !== 'All Brands' ? () => setSelectedBrand('All Brands') : undefined}
                      color='primary'
                      variant={selectedBrand === 'All Brands' ? 'outlined' : 'filled'}
                    />
                    <Chip
                      label={`Type: ${selectedType}`}
                      onDelete={selectedType !== 'All Types' ? () => setSelectedType('All Types') : undefined}
                      color='primary'
                      variant={selectedType === 'All Types' ? 'outlined' : 'filled'}
                    />
                    <Chip
                      label={`Price: $${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`}
                      color='primary'
                      variant='outlined'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant='contained'
                    startIcon={<FilterListIcon />}
                    onClick={() => setDrawerOpen(true)}
                    sx={{ height: '100%' }}>
                    More Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Car Listing */}
          <Grid item xs={12}>
            <Typography variant='h4' fontWeight='bold' gutterBottom>
              Our Collection
            </Typography>
            <Typography variant='body1' color='text.secondary' gutterBottom>
              Browse our premium selection of vehicles
            </Typography>

            {filteredCars.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  mt: 3,
                }}>
                <Typography variant='h6' color='text.secondary'>
                  No cars found matching your criteria
                </Typography>
                <Button
                  variant='text'
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange([minPrice, maxPrice]);
                    setSelectedBrand('All Brands');
                    setSelectedType('All Types');
                  }}
                  sx={{ mt: 2 }}>
                  Reset All Filters
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {filteredCars.map(car => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={car.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewCar(car)}>
                      <Box
                        sx={{
                          position: 'relative',
                          pt: '60%',
                          bgcolor: '#f5f5f5',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          overflow: 'hidden',
                        }}>
                        {/* Placeholder for car image */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#eee',
                            '&:hover': {
                              bgcolor: '#e0e0e0',
                            },
                          }}>
                          <Image src={car.images[0]} alt={car.name} layout='fill' objectFit='contain' quality={100} />
                        </Box>
                        {/* Brand Badge */}
                        {car.brand && (
                          <Chip
                            label={car.brand}
                            size='small'
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        )}
                        {/* Type Badge */}
                        {car.type && (
                          <Chip
                            label={car.type}
                            size='small'
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              bgcolor: 'primary.main',
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography gutterBottom variant='h6' component='div' noWrap sx={{ fontWeight: 'bold' }}>
                          {car.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant='body2' color='text.secondary'>
                            Color:
                          </Typography>
                          {renderColorChip(car.color)}
                        </Box>
                        <Typography variant='h6' color='primary' sx={{ fontWeight: 'bold', mt: 2 }}>
                          ${car.price.toLocaleString('en-US')}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}>
                        <Button
                          variant='contained'
                          fullWidth
                          sx={{
                            borderRadius: 4,
                            textTransform: 'none',
                            fontWeight: 'bold',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            handleViewCar(car);
                          }}>
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Filter Drawer */}
      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6' fontWeight='bold'>
              Filters
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Price Range Filter */}
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Price Range
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay='auto'
              min={minPrice}
              max={maxPrice}
              valueLabelFormat={value => `$${value.toLocaleString()}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='body2'>${priceRange[0].toLocaleString()}</Typography>
              <Typography variant='body2'>${priceRange[1].toLocaleString()}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Brand Filter */}
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Brand
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {carBrands.map(brand => (
              <ListItem
                key={brand}
                button
                selected={selectedBrand === brand}
                onClick={() => handleBrandSelect(brand)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}>
                <ListItemText
                  primary={brand}
                  primaryTypographyProps={{
                    fontWeight: selectedBrand === brand ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Type Filter */}
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Car Type
          </Typography>
          <List dense>
            {carTypes.map(type => (
              <ListItem
                key={type}
                button
                selected={selectedType === type}
                onClick={() => handleTypeSelect(type)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}>
                <ListItemText
                  primary={type}
                  primaryTypographyProps={{
                    fontWeight: selectedType === type ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => {
                setPriceRange([minPrice, maxPrice]);
                setSelectedBrand('All Brands');
                setSelectedType('All Types');
              }}>
              Reset All
            </Button>
            <Button variant='contained' fullWidth onClick={() => setDrawerOpen(false)}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Car Detail Dialog */}
      <Dialog fullWidth maxWidth='lg' open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}>
            <CloseIcon />
          </IconButton>
          {selectedCar ? (
            <CarDetail car={selectedCar} onBack={() => setOpenDialog(false)} />
          ) : (
            <Typography p={4}>No car selected.</Typography>
          )}
        </Box>
      </Dialog>

      {/* Footer */}
      <Box sx={{ bgcolor: '#111', color: 'white', mt: 6, py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCarIcon sx={{ mr: 1, fontSize: 36, color: '#ffd700' }} />
                <Typography variant='h5' fontWeight='bold'>
                  LUX CARS
                </Typography>
              </Box>
              <Typography variant='body2' color='gray.400' sx={{ mb: 2 }}>
                Your premier destination for luxury and performance vehicles. We offer the finest selection of premium cars with
                exceptional service.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Quick Links
              </Typography>
              <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
                <Box component='li' sx={{ mb: 1 }}>
                  <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                    Home
                  </Typography>
                </Box>
                <Box component='li' sx={{ mb: 1 }}>
                  <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                    Collections
                  </Typography>
                </Box>
                <Box component='li' sx={{ mb: 1 }}>
                  <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                    Shop
                  </Typography>
                </Box>
                <Box component='li' sx={{ mb: 1 }}>
                  <Typography variant='body2' sx={{ cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                    Contact
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Car Categories
              </Typography>
              <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {carTypes.slice(1).map(type => (
                  <Box component='li' key={type} sx={{ mb: 1 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: '#ffd700' },
                      }}
                      onClick={() => {
                        setSelectedType(type);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}>
                      {type} Cars
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Contact Us
              </Typography>
              <Typography variant='body2' paragraph>
                123 Luxury Lane, Beverly Hills, CA 90210
              </Typography>
              <Typography variant='body2' paragraph>
                Email: info@luxcars.com
              </Typography>
              <Typography variant='body2' paragraph>
                Phone: (800) 123-4567
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant='body2' align='center' color='gray.400'>
            © {new Date().getFullYear()} LUX CARS. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
