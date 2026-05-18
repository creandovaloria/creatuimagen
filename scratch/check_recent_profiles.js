const fs = require('fs');
const path = require('path');

// Leer y parsear .env.local de forma nativa sin dependencias externas
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env.local');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Falta configurar NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

async function checkRecentProfiles() {
  console.log('🔍 Consultando los perfiles más recientes en Supabase...');
  
  const url = `${supabaseUrl}/rest/v1/perfiles?select=id,slug,nombre,email,created_at,user_id&order=created_at.desc&limit=5`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errText}`);
    }

    const perfiles = await response.json();

    console.log('\n📋 Los últimos 5 perfiles creados en Supabase:');
    perfiles.forEach((p, index) => {
      console.log(`\n[${index + 1}] ${p.nombre} (/${p.slug})`);
      console.log(`    ✉️ Email: ${p.email}`);
      console.log(`    📅 Creado el: ${p.created_at}`);
      console.log(`    🔑 User ID: ${p.user_id}`);
    });
  } catch (error) {
    console.error('❌ Error consultando perfiles:', error.message);
  }
}

checkRecentProfiles();
