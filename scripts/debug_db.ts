import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function debugState() {
  console.log('--- Debugging DB State ---');

  // 1. Check if 'Manager' role exists
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*')
    .eq('name', 'Manager');
  
  if (rolesError) console.error('Error fetching roles:', rolesError);
  console.log('Manager Role:', roles);

  // 2. Check krsna's role
  const { data: userRoles, error: urError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('role', 'admin'); // We set it to 'admin' in previous script
  
  if (urError) console.error('Error fetching user_roles:', urError);
  console.log('Admin User Roles:', userRoles);

  // 3. Check RLS policies? 
  // We can't query pg_policies easily via JS client unless we have rpc or direct sql access.
  // But we can test if an anonymous or authenticated user can read.
  
  // Let's assume we need to fix RLS for user_roles.
}

debugState();
