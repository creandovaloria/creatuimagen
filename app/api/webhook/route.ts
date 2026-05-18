import { NextResponse } from 'next/server';
import { getMercadoPagoClient } from '@/lib/mercadopago';
import { Payment } from 'mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'System not ready' }, { status: 503 });
    
    const client = getMercadoPagoClient('BIOS');
    const body = await request.json();
    const { type, data } = body;

    // Solo nos interesan los pagos
    if (type === 'payment') {
      try {
        const paymentId = data.id;
        let paymentData;

        // MODO PRUEBA
        if (paymentId.toString().startsWith('TEST_PAYMENT')) {
          const uniqueId = Math.floor(Math.random() * 1000);
          paymentData = {
            status: 'approved',
            transaction_amount: 950,
            metadata: {
              email: 'rafart.barrios@gmail.com',
              nombre: 'Arturo Barrios Test',
              whatsapp: '525555027042',
              slug: `test-support-${uniqueId}`
            }
          };
          console.log('🧪 MODO PRUEBA ACTIVADO:', paymentData.metadata.slug);
        } else {
          const payment = new Payment(client);
          paymentData = await payment.get({ id: paymentId });
        }

        // Verificamos que el pago esté aprobado
        if (paymentData && paymentData.status === 'approved') {
          const { slug, email, nombre, whatsapp } = paymentData.metadata || {};
        
          if (!slug || !email) {
            console.error('❌ Error: El pago no contiene metadata (slug/email)');
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
          }

          // 1. Identificar o Registrar al Cliente en el CRM
          const { data: cliente, error: clienteError } = await supabase
            .schema('crm')
            .from('clientes')
            .upsert(
              { email, nombre: nombre || email.split('@')[0], telefono: whatsapp || null, origen: 'creatuimagen-bio' },
              { onConflict: 'email' }
            )
            .select('id')
            .single();

          if (clienteError) {
            console.error('❌ Error gestionando cliente en CRM:', clienteError);
          }

          // 2. CREAR USUARIO EN AUTH (Contraseña Temporal Auto-confirmada)
          const tempPassword = `Crea*${Math.random().toString(36).slice(-6).toUpperCase()}`;
          let authUser = null;
          let isNewUser = true;

          const { data: createData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { nombre, slug, role: 'cliente' }
          });

          if (authError) {
            if (authError.message.includes('already exists') || authError.status === 422) {
              console.log('ℹ️ El usuario ya existe en Auth, intentando vincular perfil existente...');
              isNewUser = false;
              const { data: listUsers, error: listError } = await supabase.auth.admin.listUsers();
              if (!listError) {
                const existingUser = listUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
                if (existingUser) {
                  authUser = { user: existingUser };
                }
              }
            } else {
              console.error('⚠️ Error creando usuario en Auth:', authError.message);
            }
          } else {
            authUser = createData;
          }

          // 3. Crear el perfil en Supabase (VINCULADO AL CLIENTE Y AL AUTH USER)
          const { error: dbError } = await supabase
            .from('perfiles')
            .insert({
              nombre: nombre || email.split('@')[0],
              email,
              slug,
              whatsapp: whatsapp || null,
              activo: true,
              rol: 'cliente',
              cliente_id: cliente?.id || null,
              user_id: authUser?.user?.id || null // <--- Vínculo clave para seguridad
            });

          if (dbError) {
            console.error('❌ Error creando perfil:', dbError.message);
            throw new Error(`DB Error: ${dbError.message}`);
          }

          // 3. Registrar la Venta en el CRM
          const { error: ventaError } = await supabase
            .schema('crm')
            .from('ventas')
            .insert({
              cliente_id: cliente?.id,
              producto: 'Bio Profile',
              monto: paymentData.transaction_amount || 0,
              metodo_pago: 'mercadopago',
              referencia: data.id.toString(),
              vendedor: 'Sistema',
              canal_venta: 'Web',
              titulo_conceptual: `Compra Automática: ${slug}`
            });

          if (ventaError) {
            console.error('❌ Error registrando venta en CRM:', ventaError);
          }

          // 4. Enviar Emails
          await sendWelcomeEmail({ 
            nombre, 
            slug, 
            email, 
            monto: paymentData.transaction_amount || 950,
            contrasena: isNewUser ? tempPassword : undefined,
            unit: 'BIOS' 
          });
          await sendAdminNotification({ nombre, slug, email, whatsapp, unit: 'BIOS' });

          console.log(`✅ Perfil ${slug} y Venta registrados con éxito.`);
        }
      } catch (error: any) {
        console.error('⚠️ Webhook Processing Error:', error.message);
        return NextResponse.json({ received: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Global Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
