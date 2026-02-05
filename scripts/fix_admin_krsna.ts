import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function grantAdminAccess() {
  const email = 'krsna@skytrips.com.au';
  console.log(`Checking user: ${email}...`);

  // 1. Get User ID
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User ${email} not found in Auth system!`);
    console.log('Available users:', users.map(u => u.email));
    return;
  }

  console.log(`Found User ID: ${user.id}`);

  // 2. Upsert into user_roles
  const { error: upsertError } = await supabase
    .from('user_roles')
    .upsert(
      { user_id: user.id, role: 'admin' },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    console.error('Error updating user_roles:', upsertError);
  } else {
    console.log('Successfully assigned "admin" role to user.');
  }

  // 3. Verify
  const { data: roleData, error: verifyError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (verifyError) {
    console.error('Error verifying role:', verifyError);
  } else {
    console.log('Verification - Current Role:', roleData);
  }
}

grantAdminAccess();
