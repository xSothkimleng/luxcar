// app/api/banner-slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

// GET - Get all banner slides
export async function GET() {
  try {
    const bannerSlides = await prisma.bannerSlide.findMany({
      include: {
        mainImage: true,
        bgImage: true,
        model: true,
      },
    });

    return NextResponse.json(bannerSlides);
  } catch (error) {
    console.error('Error fetching banner slides:', error);
    return NextResponse.json({ error: 'Failed to fetch banner slides' }, { status: 500 });
  }
}

// POST - Create a new banner slide
export async function POST(request: NextRequest) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const body = await request.json();
    const { title, subtitle, mainImageId, bgImageId, modelId } = body;

    // Validate required fields
    if (!title || !subtitle || !mainImageId || !bgImageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the banner slide
    const bannerSlide = await prisma.bannerSlide.create({
      data: {
        title,
        subtitle,
        mainImageId,
        bgImageId,
        modelId,
      },
      include: {
        mainImage: true,
        bgImage: true,
      },
    });

    return NextResponse.json(bannerSlide, { status: 201 });
  } catch (error) {
    console.error('Error creating banner slide:', error);
    return NextResponse.json({ error: 'Failed to create banner slide' }, { status: 500 });
  }
}
