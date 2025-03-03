import { Car } from '@/types/car';

export const carBrands = ['Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda', 'Lexus', 'Ford', 'Chevrolet', 'Porsche'];

// Create dummy car data
export const dummyCars: Car[] = [
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
