const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcaomxizlplvmabvypvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYW9teGl6bHBsdm1hYnZ5cHZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY2MzI3MywiZXhwIjoyMDkzMjM5MjczfQ.AYPh2N5mBkNtUQeLUpTieWW72K9w2L3EyVbtoTt3s9k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  const targetEmail = 'rafat.barrios+rafiqui@gmail.com';
  console.log(`Checking profiles and users for email: ${targetEmail}`);

  // Query perfiles table
  const { data: perfiles, error: perfilesError } = await supabase
    .from('perfiles')
    .select('id, slug, nombre, email, user_id, created_at');

  if (perfilesError) {
    console.error('Error fetching perfiles:', perfilesError);
  } else {
    console.log('\n--- ALL PERFILES ---');
    console.log(perfiles);
    console.log('\n--- MATCHING PERFILES ---');
    const matching = perfiles.filter(p => p.email?.toLowerCase() === targetEmail.toLowerCase());
    console.log(matching);
  }

  // Query auth.users via admin API
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth users:', authError);
  } else {
    console.log('\n--- AUTH USERS ---');
    const matchedUsers = authUsers.users.filter(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
    console.log(matchedUsers.map(u => ({ id: u.id, email: u.email, user_metadata: u.user_metadata })));
  }
}

checkProfiles();
