const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getProfiles() {
  console.log('🔍 Querying public.perfiles...');
  const { data, error } = await supabase
    .from('perfiles')
    .select('*');
    
  if (error) {
    console.error('❌ Error fetching profiles:', error);
  } else {
    console.log('✅ Profiles in DB:', JSON.stringify(data, null, 2));
  }
}

getProfiles();
