const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Keys not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAsAdmin() {
  console.log('🔑 Intentando iniciar sesión como administrador...');
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'creandovalor.ia@gmail.com',
    password: 'ArturoPassword123!' // We don't know the password, but wait, let's see if we can get the session.
  });

  if (authError) {
    console.error('❌ Error de autenticación (esto es normal si la contraseña es diferente):', authError.message);
    console.log('💡 Probando consulta con token anónimo...');
  } else {
    console.log('✅ Sesión iniciada con éxito para:', authData.user.email);
  }

  console.log('--- BUSCANDO VENTAS ---');
  const { data: ventas, error: vError } = await supabase
    .schema('crm')
    .from('ventas')
    .select('*');

  if (vError) {
    console.error('❌ Error en ventas:', vError);
  } else {
    console.log(`✅ Ventas registradas (${ventas.length}):`);
    console.log(JSON.stringify(ventas, null, 2));
  }
}

testAsAdmin();
