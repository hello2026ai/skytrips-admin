const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjrmemmsieltajotxddk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GxUlFYif0EEYIEYCEkqIGg_Xee1B4qZ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🚀 Starting Comprehensive API Tests for "travellers" Column');
  console.log('---------------------------------------------------------');

  // 1. Setup: Get a booking
  const { data: bookings, error: fetchError } = await supabase.from('bookings').select('id').limit(1);
  if (fetchError || !bookings || bookings.length === 0) {
    console.error('❌ Setup Failed: No bookings found to test with.');
    return;
  }
  const bookingId = bookings[0].id;
  console.log(`ℹ️  Target Booking ID: ${bookingId}`);

  // Test Case 1: Simple Update (Single Traveller)
  console.log('\n🧪 Test Case 1: Update with Single Traveller');
  const payload1 = [{
    firstName: "Test",
    lastName: "One",
    passportNumber: "T1",
    nationality: "Testland"
  }];
  await performUpdate(bookingId, payload1);

  // Test Case 2: Multiple Travellers
  console.log('\n🧪 Test Case 2: Update with Multiple Travellers');
  const payload2 = [
    { firstName: "Alice", lastName: "Smith", passportNumber: "A1", nationality: "US" },
    { firstName: "Bob", lastName: "Smith", passportNumber: "B1", nationality: "UK" }
  ];
  await performUpdate(bookingId, payload2);

  // Test Case 3: Empty Array
  console.log('\n🧪 Test Case 3: Update with Empty Array');
  await performUpdate(bookingId, []);

  console.log('\n---------------------------------------------------------');
  console.log('🏁 Tests Completed');
}

async function performUpdate(id, travellers) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ travellers: travellers })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ FAILED:', error.message);
    if (error.code === 'PGRST204') {
      console.error('   -> Root Cause: Schema cache is stale or column missing.');
    }
  } else {
    console.log('✅ PASSED');
    // Verify data
    const updated = data[0];
    if (JSON.stringify(updated.travellers) === JSON.stringify(travellers)) {
      console.log('   -> Verification: Data matches payload.');
    } else {
      console.warn('   -> Verification Failed: Data mismatch.');
    }
  }
}

runTests();
