// src/app/api/cars/paginated/route.ts
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
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

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

    const [totalCount, cars] = await Promise.all([
      prisma.car.count({
        where: filterConditions,
      }),

      prisma.car.findMany({
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
      }),
    ]);

    const response = NextResponse.json({
      items: cars,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
        filteredCount: totalCount,
      },
    });

    response.headers.set('Cache-Control', `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`);

    return response;
  } catch (error) {
    console.error('Error fetching paginated cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
