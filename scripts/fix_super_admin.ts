import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Full list of modules from types.ts
const MODULES = [
  "flights", "hotels", "customers", "travellers", "bookings", 
  "payments", "manage_booking", "media", "routes", "airlines", 
  "airports", "agencies", "users", "services", "roles"
];

const TARGET_EMAIL = "krsna@skytrips.com.au";

async function fixSuperAdmin() {
  console.log(`--- Starting Super Admin Fix for ${TARGET_EMAIL} ---`);

  // 1. Ensure 'Manager' role exists
  console.log("1. Checking 'Manager' role...");
  const { data: existingRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Manager')
    .single();

  let managerRole = existingRole;

  if (roleError && roleError.code === 'PGRST116') {
    console.log("   'Manager' role not found. Creating it...");
    const { data: newRole, error: createError } = await supabase
      .from('roles')
      .insert({ 
        name: 'Manager', 
        description: 'Full system access (Super Admin)',
        is_system: true 
      })
      .select('id')
      .single();
    
    if (createError) throw new Error(`Failed to create Manager role: ${createError.message}`);
    managerRole = newRole;
  } else if (roleError) {
    throw new Error(`Error fetching Manager role: ${roleError.message}`);
  }
  
  if (!managerRole) throw new Error("Could not obtain Manager role ID");
  console.log(`   Manager Role ID: ${managerRole.id}`);

  // 2. Grant ALL permissions to Manager role
  console.log("2. Granting FULL permissions to Manager role...");
  const permissionsToInsert = MODULES.map(moduleId => ({
    role_id: managerRole.id,
    module_id: moduleId,
    can_view: true,
    can_add: true,
    can_edit: true,
    can_delete: true
  }));

  // We use upsert to update existing or insert new
  const { error: permError } = await supabase
    .from('role_permissions')
    .upsert(permissionsToInsert, { onConflict: 'role_id, module_id' });

  if (permError) throw new Error(`Failed to grant permissions: ${permError.message}`);
  console.log("   Permissions granted successfully for all modules.");

  // 3. Assign user to 'admin' (which maps to Manager) or directly to Manager if your system uses that
  // Based on your system, you check 'user_roles' table.
  console.log(`3. Assigning ${TARGET_EMAIL} to admin/Manager...`);
  
  // First, find the user ID by email (using auth admin API)
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) throw new Error(`Failed to list users: ${userError.message}`);
  
  const targetUser = users.find((u: any) => u.email === TARGET_EMAIL);

  if (!targetUser) {
    throw new Error(`User ${TARGET_EMAIL} not found in Auth system.`);
  }
  console.log(`   User ID: ${targetUser.id}`);

  // Upsert into user_roles
  const { error: assignError } = await supabase
    .from('user_roles')
    .upsert({ 
      user_id: targetUser.id, 
      role: 'admin' // Your system maps 'admin' -> 'Manager'
    }, { onConflict: 'user_id' });

  if (assignError) throw new Error(`Failed to assign user role: ${assignError.message}`);
  
  console.log(`   User assigned to 'admin' role successfully.`);
  console.log(`--- SUCCESS: ${TARGET_EMAIL} is now a Super Admin ---`);
}

fixSuperAdmin().catch(err => {
  console.error("FAILED:", err);
  process.exit(1);
});
