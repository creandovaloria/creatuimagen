import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * Gestión de links por parte del admin (creandovalor.ia@gmail.com).
 * Bypassea RLS usando service_role para insertar o borrar links de cualquier perfil.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Solo el admin puede usar este endpoint
    if (!user || user.email !== 'creandovalor.ia@gmail.com') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { action, linkData, linkId } = await request.json();

    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: 'Sistema no disponible' }, { status: 503 });
    }

    if (action === 'insert') {
      if (!linkData || !linkData.perfil_id) {
        return NextResponse.json({ error: 'Faltan datos de linkData o perfil_id' }, { status: 400 });
      }

      const { data, error } = await adminClient
        .from('perfil_links')
        .insert([linkData])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } 
    
    if (action === 'delete') {
      if (!linkId) {
        return NextResponse.json({ error: 'Falta linkId' }, { status: 400 });
      }

      const { error } = await adminClient
        .from('perfil_links')
        .delete()
        .eq('id', linkId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('Error en /api/admin/links:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
