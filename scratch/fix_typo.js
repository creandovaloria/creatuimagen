const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcaomxizlplvmabvypvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYW9teGl6bHBsdm1hYnZ5cHZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY2MzI3MywiZXhwIjoyMDkzMjM5MjczfQ.AYPh2N5mBkNtUQeLUpTieWW72K9w2L3EyVbtoTt3s9k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTypo() {
  const profileId = '0e4867dc-dc3b-429b-8173-552719c5fbf5'; // rafiqui2 profile id
  const correctUserId = '67da4b51-12ab-4246-9138-7180c1c6dcff'; // user_id of original rafiqui
  const incorrectUserId = '06121f4d-261c-4735-a706-c15910f5ccca'; // typo user_id

  console.log(`Vincular rafiqui2 al user_id correcto: ${correctUserId}`);

  // 1. Vincular perfil al user_id correcto y corregir el email
  const { data: profileUpdate, error: profileError } = await supabase
    .from('perfiles')
    .update({ 
      user_id: correctUserId,
      email: 'rafart.barrios+rafiqui@gmail.com'
    })
    .eq('id', profileId)
    .select();

  if (profileError) {
    console.error('Error actualizando perfil:', profileError);
  } else {
    console.log('Perfil actualizado con éxito:', profileUpdate);
  }

  // 2. Eliminar el usuario duplicado con el typo de Auth
  const { data: authDelete, error: authError } = await supabase.auth.admin.deleteUser(incorrectUserId);

  if (authError) {
    console.error('Error eliminando usuario de auth con typo:', authError);
  } else {
    console.log('Usuario duplicado de auth eliminado con éxito.');
  }
}

fixTypo();
