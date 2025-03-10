import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Create colors
  console.log('Creating colors...');
  const colors = await Promise.all([
    prisma.color.upsert({
      where: { name: 'Red' },
      update: {},
      create: { name: 'Red', rgb: '#FF0000' },
    }),
    prisma.color.upsert({
      where: { name: 'Blue' },
      update: {},
      create: { name: 'Blue', rgb: '#0000FF' },
    }),
    prisma.color.upsert({
      where: { name: 'Black' },
      update: {},
      create: { name: 'Black', rgb: '#000000' },
    }),
    prisma.color.upsert({
      where: { name: 'Silver' },
      update: {},
      create: { name: 'Silver', rgb: '#C0C0C0' },
    }),
    prisma.color.upsert({
      where: { name: 'White' },
      update: {},
      create: { name: 'White', rgb: '#FFFFFF' },
    }),
  ]);

  console.log(`Created ${colors.length} colors`);

  // Create brands
  console.log('Creating brands...');
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { name: 'Tesla' },
      update: {},
      create: { name: 'Tesla' },
    }),
    prisma.brand.upsert({
      where: { name: 'BMW' },
      update: {},
      create: { name: 'BMW' },
    }),
    prisma.brand.upsert({
      where: { name: 'Mercedes-Benz' },
      update: {},
      create: { name: 'Mercedes-Benz' },
    }),
    prisma.brand.upsert({
      where: { name: 'Audi' },
      update: {},
      create: { name: 'Audi' },
    }),
    prisma.brand.upsert({
      where: { name: 'Toyota' },
      update: {},
      create: { name: 'Toyota' },
    }),
    prisma.brand.upsert({
      where: { name: 'Hot Wheels' },
      update: {},
      create: { name: 'Hot Wheels' },
    }),
    prisma.brand.upsert({
      where: { name: 'Matchbox' },
      update: {},
      create: { name: 'Matchbox' },
    }),
    prisma.brand.upsert({
      where: { name: 'Tomica' },
      update: {},
      create: { name: 'Tomica' },
    }),
  ]);

  console.log(`Created ${brands.length} brands`);

  // Create models
  console.log('Creating models...');
  const models = await Promise.all([
    prisma.model.upsert({
      where: { name: 'Model S' },
      update: {},
      create: { name: 'Model S' },
    }),
    prisma.model.upsert({
      where: { name: '5 Series' },
      update: {},
      create: { name: '5 Series' },
    }),
    prisma.model.upsert({
      where: { name: 'E-Class' },
      update: {},
      create: { name: 'E-Class' },
    }),
    prisma.model.upsert({
      where: { name: 'A6' },
      update: {},
      create: { name: 'A6' },
    }),
    prisma.model.upsert({
      where: { name: 'Camry Hybrid' },
      update: {},
      create: { name: 'Camry Hybrid' },
    }),
  ]);

  console.log(`Created ${models.length} models`);

  // Create thumbnail images
  console.log('Creating thumbnail images...');
  const thumbnailImages = await Promise.all([
    prisma.thumbnailImage.create({
      data: {
        url: '/assets/images/sampleCar.jpg',
      },
    }),
    prisma.thumbnailImage.create({
      data: {
        url: '/assets/images/sampleCar2.jpg',
      },
    }),
    prisma.thumbnailImage.create({
      data: {
        url: '/assets/images/sampleCar3.jpg',
      },
    }),
    prisma.thumbnailImage.create({
      data: {
        url: '/assets/images/sampleCar4.jpg',
      },
    }),
  ]);

  console.log(`Created ${thumbnailImages.length} thumbnail images`);

  // Helper function to find entity by name
  interface NamedEntity {
    id: string;
    name: string;
  }

  const findEntityByName = <T extends NamedEntity>(entities: T[], name: string): T | undefined => {
    return entities.find(entity => entity.name === name);
  };

  // Create cars and their variant images
  console.log('Creating cars and variant images...');

  // Define car data based on the dummy data
  const carsData = [
    {
      name: 'Tesla Model S',
      price: 89999.99,
      scale: '1:18',
      description:
        '<p>The <strong>Tesla Model S</strong> is an all-electric five-door liftback sedan produced by Tesla, Inc. The Model S features a dual-motor all-wheel drive setup and can accelerate from 0-60 mph in just 2.3 seconds.</p><p>This model includes:</p><ul><li>Autopilot functionality</li><li>17-inch touchscreen display</li><li>Wireless charging</li><li>Premium audio system</li></ul>',
      colorName: 'Red',
      brandName: 'Tesla',
      modelName: 'Model S',
      thumbnailUrl: '/assets/images/sampleCar.jpg',
      variantUrls: ['/assets/images/sampleCar2.jpg', '/assets/images/sampleCar3.jpg', '/assets/images/sampleCar4.jpg'],
    },
    {
      name: 'BMW 5 Series',
      price: 62999.99,
      scale: '1:24',
      description:
        '<p>The <strong>BMW 5 Series</strong> is a luxury sedan that combines elegant styling with advanced technology and driving dynamics. This car offers a perfect balance of comfort, performance, and efficiency.</p><p>Key features:</p><ul><li>10.25-inch touchscreen infotainment system</li><li>Leather upholstery</li><li>Ambient interior lighting</li><li>Advanced driver assistance systems</li></ul>',
      colorName: 'Blue',
      brandName: 'BMW',
      modelName: '5 Series',
      thumbnailUrl: '/assets/images/sampleCar2.jpg',
      variantUrls: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar3.jpg', '/assets/images/sampleCar4.jpg'],
    },
    {
      name: 'Mercedes-Benz E-Class',
      price: 65499.99,
      scale: '1:24',
      description:
        '<p>The <strong>Mercedes-Benz E-Class</strong> represents the pinnacle of luxury and refinement in the mid-size sedan segment. With its elegant design and cutting-edge technology, it delivers an exceptional driving experience.</p><p>Highlights include:</p><ul><li>MBUX infotainment system</li><li>Premium Burmester sound system</li><li>64-color ambient lighting</li><li>Air Body Control suspension</li></ul>',
      colorName: 'Black',
      brandName: 'Mercedes-Benz',
      modelName: 'E-Class',
      thumbnailUrl: '/assets/images/sampleCar3.jpg',
      variantUrls: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar2.jpg', '/assets/images/sampleCar4.jpg'],
    },
    {
      name: 'Audi A6',
      price: 58999.99,
      scale: '1:18',
      description:
        '<p>The <strong>Audi A6</strong> is a sophisticated executive sedan with cutting-edge technology and a refined interior. The car offers a smooth ride with powerful performance options.</p><p>Features include:</p><ul><li>Dual touchscreen MMI system</li><li>Virtual Cockpit Plus</li><li>Bang & Olufsen 3D Premium Sound System</li><li>Quattro all-wheel drive</li></ul>',
      colorName: 'Silver',
      brandName: 'Audi',
      modelName: 'A6',
      thumbnailUrl: '/assets/images/sampleCar4.jpg',
      variantUrls: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar2.jpg', '/assets/images/sampleCar3.jpg'],
    },
    {
      name: 'Toyota Camry Hybrid',
      price: 32999.99,
      scale: '1:24',
      description:
        '<p>The <strong>Toyota Camry Hybrid</strong> combines efficiency and reliability with a comfortable ride. This fuel-efficient sedan is perfect for daily commuting while reducing your carbon footprint.</p><p>Key specifications:</p><ul><li>2.5L 4-cylinder hybrid engine</li><li>8-inch touchscreen</li><li>Apple CarPlay and Android Auto</li><li>Toyota Safety Sense 2.5+</li></ul>',
      colorName: 'White',
      brandName: 'Toyota',
      modelName: 'Camry Hybrid',
      thumbnailUrl: '/assets/images/sampleCar2.jpg',
      variantUrls: ['/assets/images/sampleCar.jpg', '/assets/images/sampleCar3.jpg', '/assets/images/sampleCar4.jpg'],
    },
  ];

  for (const carData of carsData) {
    // Find the related entities
    const color = findEntityByName(colors, carData.colorName);
    const brand = findEntityByName(brands, carData.brandName);
    const model = findEntityByName(models, carData.modelName);

    // Find the thumbnail image
    const thumbnailImage = thumbnailImages.find(img => img.url === carData.thumbnailUrl);

    if (!color || !brand || !model || !thumbnailImage) {
      console.error(`Missing related entity for car ${carData.name}`);
      continue;
    }

    // Create the car
    const car = await prisma.car.create({
      data: {
        name: carData.name,
        price: carData.price,
        scale: carData.scale,
        description: carData.description,
        colorId: color.id,
        brandId: brand.id,
        modelId: model.id,
        thumbnailImageId: thumbnailImage.id,
      },
    });

    // Create variant images for this car
    for (const variantUrl of carData.variantUrls) {
      await prisma.variantImage.create({
        data: {
          url: variantUrl,
          carId: car.id,
        },
      });
    }

    console.log(`Created car: ${car.name}`);
  }

  // Create an admin user
  console.log('Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: '$2a$10$ixfm5qOzMDj5GkPUM.9pZeCE/hHWMhVW6TM2FHXnRge3D0hK2T9XS', // "password123" hashed
      role: 'ADMIN',
    },
  });

  console.log(`Created admin user: ${adminUser.username}`);
  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
