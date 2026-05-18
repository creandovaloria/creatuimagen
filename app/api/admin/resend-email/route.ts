import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/resend-email
 * Actualiza el email de un perfil en Supabase y reenvía el correo de bienvenida.
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

    const { slug, newEmail } = await request.json();

    if (!slug || !newEmail) {
      return NextResponse.json({ error: 'Faltan slug o newEmail' }, { status: 400 });
    }

    // Validar formato básico del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Formato de correo inválido' }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: 'Sistema no disponible' }, { status: 503 });
    }

    // 1. Obtener datos actuales del perfil
    const { data: profile, error: fetchError } = await adminClient
      .from('perfiles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    // 2. Actualizar el email en la tabla perfiles
    const { error: updateError } = await adminClient
      .from('perfiles')
      .update({ email: newEmail })
      .eq('slug', slug);

    if (updateError) {
      return NextResponse.json({ error: `Error actualizando email: ${updateError.message}` }, { status: 500 });
    }

    // 3. Reenviar el correo de bienvenida al nuevo email
    const emailResult = await sendWelcomeEmail({
      nombre: profile.nombre,
      slug: profile.slug,
      email: newEmail,
      monto: 950,
      unit: 'BIOS',
    });

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        emailUpdated: true,
        emailSent: false,
        error: `Email actualizado en BD pero falló el envío: ${emailResult.error}`,
      });
    }

    return NextResponse.json({
      success: true,
      emailUpdated: true,
      emailSent: true,
      message: `Email actualizado y correo de bienvenida reenviado a ${newEmail}`,
    });

  } catch (error: any) {
    console.error('Error en /api/admin/resend-email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
