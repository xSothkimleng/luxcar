import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define cache duration
const CACHE_SHORT = 60; // 1 minute (for frequently changing data)
const CACHE_MEDIUM = 60 * 10; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters with defaults
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Change default sort to price and default order to ascending
    const sort = searchParams.get('sort') || 'price';
    const order = searchParams.get('order') || 'asc';

    // Extract filter parameters
    const search = searchParams.get('search') || '';
    const brandId = searchParams.get('brandId');
    const colorId = searchParams.get('colorId');
    const modelId = searchParams.get('modelId');
    const statusId = searchParams.get('statusId');

    // Determine cache duration based on query type
    let cacheDuration = CACHE_MEDIUM;
    if (search || page > 1) {
      // Shorter cache for searches and paginated results
      cacheDuration = CACHE_SHORT;
    }

    // Validate pagination inputs
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    // Build the filter conditions
    const filterConditions: Prisma.CarWhereInput = {};

    // Add search condition
    if (search) {
      filterConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add specific filters
    if (brandId) {
      filterConditions.brandId = brandId;
    }

    if (colorId) {
      filterConditions.colorId = colorId;
    }

    if (modelId) {
      filterConditions.modelId = modelId;
    }

    if (statusId) {
      filterConditions.statusId = statusId;
    }

    const skip = (page - 1) * limit;

    const [totalCount, allCars] = await Promise.all([
      prisma.car.count({
        where: filterConditions,
      }),

      prisma.car.findMany({
        where: filterConditions,
        include: {
          color: true,
          brand: true,
          model: true,
          status: true,
          thumbnailImage: true,
          variantImages: true,
        },
      }),
    ]);

    // Handle sorting manually if sorting by price
    let cars;
    if (sort === 'price') {
      // Convert from BigInt or Decimal to number for sorting
      const sortedCars = [...allCars].sort((a, b) => {
        const priceA = parseFloat(a.price.toString());
        const priceB = parseFloat(b.price.toString());
        return order.toLowerCase() === 'asc' ? priceA - priceB : priceB - priceA;
      });

      // Apply pagination manually after sorting
      cars = sortedCars.slice(skip, skip + limit);
    } else {
      // For other fields, use Prisma's built-in sorting
      cars = await prisma.car.findMany({
        where: filterConditions,
        skip,
        take: limit,
        orderBy: {
          [sort]: order.toLowerCase() === 'asc' ? 'asc' : 'desc',
        },
        include: {
          color: true,
          brand: true,
          model: true,
          status: true,
          thumbnailImage: true,
          variantImages: true,
        },
      });
    }

    // Add debug info
    console.log(`Sorting by ${sort} in ${order} order`);
    console.log(
      'First few cars prices:',
      cars.slice(0, 5).map(car => ({
        name: car.name,
        price: car.price.toString(),
      })),
    );

    const response = NextResponse.json({
      items: cars,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
        filteredCount: totalCount,
        sortedBy: sort,
        sortOrder: order,
      },
    });

    response.headers.set('Cache-Control', `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`);

    return response;
  } catch (error) {
    console.error('Error fetching paginated cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
