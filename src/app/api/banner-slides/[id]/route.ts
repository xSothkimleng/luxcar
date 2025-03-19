/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/banner-slides/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/apiAuth';

// GET - Get a banner slide by ID
export async function GET(request: NextRequest, context: any) {
  try {
    const id = context.params.id;

    const bannerSlide = await prisma.bannerSlide.findUnique({
      where: { id },
      include: {
        mainImage: true,
        bgImage: true,
      },
    });

    if (!bannerSlide) {
      return NextResponse.json({ error: 'Banner slide not found' }, { status: 404 });
    }

    return NextResponse.json(bannerSlide);
  } catch (error) {
    console.error('Error fetching banner slide:', error);
    return NextResponse.json({ error: 'Failed to fetch banner slide' }, { status: 500 });
  }
}

// PUT - Update a banner slide
export async function PUT(request: NextRequest, context: any) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const id = context.params.id;
    const body = await request.json();
    const { title, subtitle, mainImageId, bgImageId } = body;

    // Ensure the slide exists
    const existingSlide = await prisma.bannerSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return NextResponse.json({ error: 'Banner slide not found' }, { status: 404 });
    }

    // Update the banner slide
    const updatedSlide = await prisma.bannerSlide.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(mainImageId && { mainImageId }),
        ...(bgImageId && { bgImageId }),
      },
      include: {
        mainImage: true,
        bgImage: true,
      },
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error('Error updating banner slide:', error);
    return NextResponse.json({ error: 'Failed to update banner slide' }, { status: 500 });
  }
}

// DELETE - Delete a banner slide
export async function DELETE(request: NextRequest, context: any) {
  // Check admin access
  if (!(await isAdmin(request))) {
    return unauthorized();
  }
  try {
    const id = context.params.id;

    // Ensure the slide exists
    const existingSlide = await prisma.bannerSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return NextResponse.json({ error: 'Banner slide not found' }, { status: 404 });
    }

    // Delete the banner slide
    await prisma.bannerSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner slide:', error);
    return NextResponse.json({ error: 'Failed to delete banner slide' }, { status: 500 });
  }
}
