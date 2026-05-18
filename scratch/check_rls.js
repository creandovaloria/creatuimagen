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

async function getRLSPolicies() {
  console.log('🔍 Querying RLS policies...');
  const { data, error } = await supabase.rpc('get_policies'); // If RPC exists, otherwise standard SQL query via SELECT
  
  if (error) {
    console.log('❌ RPC get_policies failed, running direct SQL query...');
    // We can query pg_policies using select
    const { data: policies, error: sqlError } = await supabase
      .from('pg_policies') // Wait, is pg_policies exposed in public? Let's try executing SQL
      .select('*')
      .eq('tablename', 'perfiles');
      
    if (sqlError) {
      console.error('❌ SQL check failed:', sqlError.message);
      // Let's run a direct query by checking if we can select from a custom view or similar, or just try to describe RLS policies
      const { data: rawSql, error: rawError } = await supabase.rpc('exec_sql', {
        sql_query: "SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'perfiles'"
      });
      if (rawError) {
        console.error('❌ Direct exec_sql failed:', rawError);
      } else {
        console.log('✅ RLS Policies found:', JSON.stringify(rawSql, null, 2));
      }
    } else {
      console.log('✅ RLS Policies found:', JSON.stringify(policies, null, 2));
    }
  } else {
    console.log('✅ Policies:', JSON.stringify(data, null, 2));
  }
}

getRLSPolicies();
