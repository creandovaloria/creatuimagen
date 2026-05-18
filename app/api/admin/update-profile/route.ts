import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/update-profile
 * Actualiza perfil y VCF de cualquier usuario usando service_role (bypassea RLS).
 * Solo accesible para el admin (creandovalor.ia@gmail.com).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Solo el admin puede usar este endpoint
    if (!user || user.email !== 'creandovalor.ia@gmail.com') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { slug, perfilId, perfilUpdates, vcfUpdates } = await request.json();

    if (!slug || !perfilId) {
      return NextResponse.json({ error: 'Faltan slug o perfilId' }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: 'Sistema no disponible' }, { status: 503 });
    }

    // 1. Actualizar perfil (bypasseando RLS)
    const { error: perfilError } = await adminClient
      .from('perfiles')
      .update(perfilUpdates)
      .eq('slug', slug);

    if (perfilError) {
      return NextResponse.json({ error: `Error actualizando perfil: ${perfilError.message}` }, { status: 500 });
    }

    // 2. Upsert VCF (bypasseando RLS)
    if (vcfUpdates && Object.keys(vcfUpdates).length > 0) {
      const { error: vcfError } = await adminClient
        .from('contactos_vcf')
        .upsert({
          perfil_id: perfilId,
          ...vcfUpdates,
        }, { onConflict: 'perfil_id' });

      if (vcfError) {
        return NextResponse.json({ error: `Error actualizando VCF: ${vcfError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en /api/admin/update-profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
