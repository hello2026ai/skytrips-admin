const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjrmemmsieltajotxddk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GxUlFYif0EEYIEYCEkqIGg_Xee1B4qZ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Fetching one booking to check schema...');
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Available columns:', Object.keys(data[0]));
  } else {
    console.log('No bookings found.');
  }
}

checkSchema();
