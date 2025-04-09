// src/app/api/cars/paginated/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Get total count of filtered cars for pagination metadata
    const totalCount = await prisma.car.count({
      where: filterConditions,
    });

    // Fetch paginated cars with filters
    const cars = await prisma.car.findMany({
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

    // Return data with pagination metadata
    return NextResponse.json({
      items: cars,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
        filteredCount: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching paginated cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
