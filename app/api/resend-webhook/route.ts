import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { sendAdminBounceAlert } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * Webhook de Resend — Detecta rebotes (bounces) de correos enviados.
 * Resend envía eventos firmados con SVIX cuando un email no puede entregarse.
 * Configurar en: https://resend.com/webhooks
 * URL: https://bios.creatuimagen.online/api/resend-webhook
 * Eventos a suscribir: email.bounced, email.complained
 */
export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    const body = await request.text();

    // Verificar firma de Resend (usando svix) si hay un secreto configurado
    if (webhookSecret) {
      const svixId = request.headers.get('svix-id');
      const svixTimestamp = request.headers.get('svix-timestamp');
      const svixSignature = request.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        console.error('❌ Webhook de Resend sin headers de firma svix');
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
      }

      try {
        const wh = new Webhook(webhookSecret);
        wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch (err) {
        console.error('❌ Firma de webhook de Resend inválida:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { type, data } = payload;

    console.log(`📨 Evento de Resend recibido: ${type}`, data);

    // Solo procesamos bounces y spam complaints
    if (type === 'email.bounced' || type === 'email.complained') {
      const toAddresses: string[] = data?.to || [];
      const subject: string = data?.subject || '(sin asunto)';
      const emailId: string = data?.email_id || 'N/A';
      const bounceType: string = data?.bounce_type || (type === 'email.complained' ? 'spam_complaint' : 'unknown');

      console.error(`🚨 Rebote detectado para: ${toAddresses.join(', ')} | Tipo: ${bounceType} | ID: ${emailId}`);

      // Notificar al admin por correo con alerta roja
      await sendAdminBounceAlert({
        toAddresses,
        subject,
        emailId,
        bounceType,
        eventType: type,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('💥 Error en webhook de Resend:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
