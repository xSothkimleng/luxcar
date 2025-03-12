import { Car } from '@/types/car';

export const carBrands = [
  { id: '1', name: 'Tesla' },
  { id: '2', name: 'BMW' },
  { id: '3', name: 'Mercedes-Benz' },
  { id: '4', name: 'Audi' },
  { id: '5', name: 'Toyota' },
  { id: '6', name: 'Honda' },
  { id: '7', name: 'Lexus' },
  { id: '8', name: 'Ford' },
  { id: '9', name: 'Chevrolet' },
  { id: '10', name: 'Porsche' },
];

export const carColors = [
  { id: '1', name: 'Red', rgb: '#FF0000' },
  { id: '2', name: 'Blue', rgb: '#0000FF' },
  { id: '3', name: 'Black', rgb: '#000000' },
  { id: '4', name: 'Silver', rgb: '#C0C0C0' },
  { id: '5', name: 'White', rgb: '#FFFFFF' },
];

export const carModels = [
  { id: '1', name: 'Model S' },
  { id: '2', name: '5 Series' },
  { id: '3', name: 'E-Class' },
  { id: '4', name: 'A6' },
  { id: '5', name: 'Camry Hybrid' },
];

// Create dummy car data with adjusted structure
export const dummyCars: Car[] = [
  {
    id: '1',
    name: 'Tesla Model S',
    price: 89999.99,
    scale: 'Full-size',
    description:
      '<p>The <strong>Tesla Model S</strong> is an all-electric five-door liftback sedan produced by Tesla, Inc. The Model S features a dual-motor all-wheel drive setup and can accelerate from 0-60 mph in just 2.3 seconds.</p><p>This model includes:</p><ul><li>Autopilot functionality</li><li>17-inch touchscreen display</li><li>Wireless charging</li><li>Premium audio system</li></ul>',
    colorId: '1',
    brandId: '1',
    modelId: '1',
    thumbnailImageId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: {
      id: '1',
      name: 'Red',
      rgb: '#FF0000',
    },
    brand: {
      id: '1',
      name: 'Tesla',
    },
    model: {
      id: '1',
      name: 'Model S',
    },
    thumbnailImage: {
      id: '1',
      url: '/assets/images/sampleCar.jpg',
    },
    variantImages: [
      {
        id: '1',
        url: '/assets/images/sampleCar.jpg',
        carId: '1',
      },
      {
        id: '2',
        url: '/assets/images/sampleCar2.jpg',
        carId: '1',
      },
      {
        id: '3',
        url: '/assets/images/sampleCar3.jpg',
        carId: '1',
      },
      {
        id: '4',
        url: '/assets/images/sampleCar4.jpg',
        carId: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'BMW 5 Series',
    price: 62999.99,
    scale: 'Mid-size',
    description:
      '<p>The <strong>BMW 5 Series</strong> is a luxury sedan that combines elegant styling with advanced technology and driving dynamics. This car offers a perfect balance of comfort, performance, and efficiency.</p><p>Key features:</p><ul><li>10.25-inch touchscreen infotainment system</li><li>Leather upholstery</li><li>Ambient interior lighting</li><li>Advanced driver assistance systems</li></ul>',
    colorId: '2',
    brandId: '2',
    modelId: '2',
    thumbnailImageId: '5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: {
      id: '2',
      name: 'Blue',
      rgb: '#0000FF',
    },
    brand: {
      id: '2',
      name: 'BMW',
    },
    model: {
      id: '2',
      name: '5 Series',
    },
    thumbnailImage: {
      id: '5',
      url: '/assets/images/sampleCar2.jpg',
    },
    variantImages: [
      {
        id: '5',
        url: '/assets/images/sampleCar2.jpg',
        carId: '2',
      },
      {
        id: '6',
        url: '/assets/images/sampleCar.jpg',
        carId: '2',
      },
      {
        id: '7',
        url: '/assets/images/sampleCar3.jpg',
        carId: '2',
      },
      {
        id: '8',
        url: '/assets/images/sampleCar4.jpg',
        carId: '2',
      },
    ],
  },
  {
    id: '3',
    name: 'Mercedes-Benz E-Class',
    price: 65499.99,
    scale: 'Mid-size',
    description:
      '<p>The <strong>Mercedes-Benz E-Class</strong> represents the pinnacle of luxury and refinement in the mid-size sedan segment. With its elegant design and cutting-edge technology, it delivers an exceptional driving experience.</p><p>Highlights include:</p><ul><li>MBUX infotainment system</li><li>Premium Burmester sound system</li><li>64-color ambient lighting</li><li>Air Body Control suspension</li></ul>',
    colorId: '3',
    brandId: '3',
    modelId: '3',
    thumbnailImageId: '9',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: {
      id: '3',
      name: 'Black',
      rgb: '#000000',
    },
    brand: {
      id: '3',
      name: 'Mercedes-Benz',
    },
    model: {
      id: '3',
      name: 'E-Class',
    },
    thumbnailImage: {
      id: '9',
      url: '/assets/images/sampleCar3.jpg',
    },
    variantImages: [
      {
        id: '9',
        url: '/assets/images/sampleCar3.jpg',
        carId: '3',
      },
      {
        id: '10',
        url: '/assets/images/sampleCar.jpg',
        carId: '3',
      },
      {
        id: '11',
        url: '/assets/images/sampleCar2.jpg',
        carId: '3',
      },
      {
        id: '12',
        url: '/assets/images/sampleCar4.jpg',
        carId: '3',
      },
    ],
  },
  {
    id: '4',
    name: 'Audi A6',
    price: 58999.99,
    scale: 'Mid-size',
    description:
      '<p>The <strong>Audi A6</strong> is a sophisticated executive sedan with cutting-edge technology and a refined interior. The car offers a smooth ride with powerful performance options.</p><p>Features include:</p><ul><li>Dual touchscreen MMI system</li><li>Virtual Cockpit Plus</li><li>Bang & Olufsen 3D Premium Sound System</li><li>Quattro all-wheel drive</li></ul>',
    colorId: '4',
    brandId: '4',
    modelId: '4',
    thumbnailImageId: '13',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: {
      id: '4',
      name: 'Silver',
      rgb: '#C0C0C0',
    },
    brand: {
      id: '4',
      name: 'Audi',
    },
    model: {
      id: '4',
      name: 'A6',
    },
    thumbnailImage: {
      id: '13',
      url: '/assets/images/sampleCar4.jpg',
    },
    variantImages: [
      {
        id: '13',
        url: '/assets/images/sampleCar4.jpg',
        carId: '4',
      },
      {
        id: '14',
        url: '/assets/images/sampleCar.jpg',
        carId: '4',
      },
      {
        id: '15',
        url: '/assets/images/sampleCar2.jpg',
        carId: '4',
      },
      {
        id: '16',
        url: '/assets/images/sampleCar3.jpg',
        carId: '4',
      },
    ],
  },
  {
    id: '5',
    name: 'Toyota Camry Hybrid',
    price: 32999.99,
    scale: 'Mid-size',
    description:
      '<p>The <strong>Toyota Camry Hybrid</strong> combines efficiency and reliability with a comfortable ride. This fuel-efficient sedan is perfect for daily commuting while reducing your carbon footprint.</p><p>Key specifications:</p><ul><li>2.5L 4-cylinder hybrid engine</li><li>8-inch touchscreen</li><li>Apple CarPlay and Android Auto</li><li>Toyota Safety Sense 2.5+</li></ul>',
    colorId: '5',
    brandId: '5',
    modelId: '5',
    thumbnailImageId: '17',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: {
      id: '5',
      name: 'White',
      rgb: '#FFFFFF',
    },
    brand: {
      id: '5',
      name: 'Toyota',
    },
    model: {
      id: '5',
      name: 'Camry Hybrid',
    },
    thumbnailImage: {
      id: '17',
      url: '/assets/images/sampleCar2.jpg',
    },
    variantImages: [
      {
        id: '17',
        url: '/assets/images/sampleCar2.jpg',
        carId: '5',
      },
      {
        id: '18',
        url: '/assets/images/sampleCar.jpg',
        carId: '5',
      },
      {
        id: '19',
        url: '/assets/images/sampleCar3.jpg',
        carId: '5',
      },
      {
        id: '20',
        url: '/assets/images/sampleCar4.jpg',
        carId: '5',
      },
    ],
  },
];
