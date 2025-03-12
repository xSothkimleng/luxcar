// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log initialization details without exposing sensitive data
console.log('Initializing Supabase client with:', {
  urlProvided: !!supabaseUrl,
  keyProvided: !!supabaseKey,
  urlLength: supabaseUrl.length,
  keyLength: supabaseKey.length,
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
try {
  // This will execute on import
  const testConnection = async () => {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log(
        'Supabase connection successful, available buckets:',
        data.map(b => b.name),
      );
    }
  };

  // Run the test but don't block initialization
  testConnection();
} catch (err) {
  console.error('Error testing Supabase connection:', err);
}

// Helper function to get a public URL for a file path
export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from('car-images').getPublicUrl(path);
  return data.publicUrl;
};
