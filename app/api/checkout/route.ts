import { Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import { getMercadoPagoClient } from '@/lib/mercadopago';
import { sendAbandonmentNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, slug, whatsapp } = body;
    const monto = Number(process.env.MP_TEST_PRICE) || 950;

    // Notificar al admin sobre el intento de compra (Lead)
    await sendAbandonmentNotification({ nombre, slug, email, whatsapp, monto, unit: 'BIOS' });

    const client = getMercadoPagoClient('BIOS');

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'bio-pro-anual',
            title: 'Perfil Digital Bio Pro (1 año)',
            quantity: 1,
            unit_price: Number(process.env.MP_TEST_PRICE) || 950, // Precio en MXN (configurable para pruebas reales de bajo costo)
            currency_id: 'MXN',
          }
        ],
        payer: {
          name: nombre,
          email: email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL || 'https://bios.creatuimagen.online'}/registro/exito?slug=${slug}`,
          failure: `${process.env.NEXT_PUBLIC_URL || 'https://bios.creatuimagen.online'}/registro?error=pago-fallido`,
          pending: `${process.env.NEXT_PUBLIC_URL || 'https://bios.creatuimagen.online'}/registro/pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_URL || 'https://bios.creatuimagen.online'}/api/webhook`,
        external_reference: slug,
        metadata: {
          slug,
          email,
          nombre,
          whatsapp
        }
      }
    });

    // Determinar si usar sandbox_init_point o init_point
    // Se usa sandbox_init_point si la variable MP_SANDBOX_MODE es 'true' o si el token empieza con 'TEST-'
    const useSandbox = process.env.MP_SANDBOX_MODE === 'true' || 
                       process.env.MP_BIOS_ACCESS_TOKEN?.startsWith('TEST-') || 
                       process.env.MP_ACCESS_TOKEN?.startsWith('TEST-');
    
    const checkoutUrl = useSandbox ? (result.sandbox_init_point || result.init_point) : result.init_point;

    return NextResponse.json({ id: result.id, url: checkoutUrl });
  } catch (error: any) {
    console.error('Error creando preferencia MP:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
