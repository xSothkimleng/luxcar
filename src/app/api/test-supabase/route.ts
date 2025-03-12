import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection');
    console.log('Environment variables:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    // List buckets to test connection
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase connection failed',
          details: error,
        },
        { status: 500 },
      );
    }

    // Check if 'car-images' bucket exists
    const carImagesBucket = data.find(bucket => bucket.name === 'car-images');

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      buckets: data.map(b => b.name),
      carImagesBucketExists: !!carImagesBucket,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
