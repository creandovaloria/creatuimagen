import { Resend } from 'resend';

/**
 * Gestor de Emails por Unidad de Negocio (Resend)
 */
export type BusinessUnit = 'BIOS' | 'EVENTOS' | 'ARTURO';

function getResendClient(unit: BusinessUnit = 'BIOS') {
  let apiKey = '';
  let fromEmail = '';

  switch (unit) {
    case 'BIOS':
    case 'EVENTOS':
      apiKey = process.env.RESEND_BIOS_CREA_TU_IMAGEN_API_KEY || '';
      fromEmail = 'Crea Tu Imagen Online <bienvenida@mail.bios.creatuimagen.online>';
      break;
    case 'ARTURO':
      apiKey = process.env.RESEND_ARTURO_API_KEY || '';
      fromEmail = 'Arturo Barrios - IA <ia@arturobarrios.com>';
      break;
  }

  return { client: new Resend(apiKey), from: fromEmail };
}

interface WelcomeEmailProps {
  nombre: string;
  slug: string;
  email: string;
  monto?: number;
  contrasena?: string;
  whatsapp?: string;
  unit?: BusinessUnit;
}

export async function sendWelcomeEmail({ nombre, slug, email, monto = 950, contrasena, unit = 'BIOS' }: WelcomeEmailProps) {
  try {
    const { client, from } = getResendClient(unit);
    
    // Generar texto personalizado para el botón de WhatsApp
    const waText = `¡Hola! Soy ${nombre}. Acabo de adquirir mi Bio Digital Profesional por $${monto} MXN (Estado: Completado ✅) y necesito soporte para la configuración. Mi link reservado es: bios.creatuimagen.online/${slug}`;
    const waEncoded = encodeURIComponent(waText);
    
    const data = await client.emails.send({
      from: from, 
      to: email,
      replyTo: 'arturo.barrios@bios.creatuimagen.online',
      subject: `¡Tu Bio ya está lista, ${nombre}! 🚀`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; color: #1e293b; background: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #2563eb; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 18px; display: inline-block; font-size: 32px; font-weight: 900; font-style: italic;">B</div>
          </div>

          <h1 style="color: #0f172a; font-size: 26px; font-weight: 900; text-align: center; margin-bottom: 10px;">¡Felicidades ${nombre}! 🚀</h1>
          <p style="font-size: 16px; line-height: 1.6; text-align: center; color: #64748b; margin-bottom: 30px;">Tu pago ha sido confirmado. A continuación están las credenciales para acceder a tu panel de edición:</p>
          
          <div style="background: #fffbeb; padding: 24px; border-radius: 20px; border: 1px solid #fef3c7; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #92400e;">🔑 Credenciales de Acceso al Editor:</p>
            <p style="margin: 0 0 8px 0; font-size: 15px; color: #b45309;"><b>Usuario / Correo:</b> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0f172a;">${email}</span></p>
            ${contrasena ? `<p style="margin: 0 0 12px 0; font-size: 15px; color: #b45309;"><b>Contraseña Temporal:</b> <span style="font-family: monospace; font-size: 16px; background: #fef08a; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #0f172a; border: 1px solid #fde047;">${contrasena}</span></p>` : ''}
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #d97706; line-height: 1.4; border-top: 1px dashed #fde68a; padding-top: 10px;">
              <i><b>NOTA:</b> Da clic en el botón de abajo e ingresa estas credenciales para empezar a personalizar tu Bio al instante.</i>
            </p>
          </div>

          <a href="https://bios.creatuimagen.online/login" 
             style="display: block; background: #2563eb; color: white; padding: 20px; border-radius: 16px; text-decoration: none; text-align: center; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2); margin-bottom: 30px;">
            🔓 Iniciar Sesión y Editar mi Bio
          </a>

          <div style="background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">📄 Resumen de tu Compra:</p>
            <table style="width: 100%; font-size: 14px; color: #64748b; margin-bottom: 15px;">
              <tr>
                <td style="padding: 5px 0;">Producto:</td>
                <td style="text-align: right; color: #1e293b; font-weight: bold;">Bio Digital Profesional</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Monto pagado:</td>
                <td style="text-align: right; color: #1e293b; font-weight: bold;">$${monto} MXN</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Estado:</td>
                <td style="text-align: right; color: #059669; font-weight: bold;">Completado ✅</td>
              </tr>
            </table>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: center; border: 1px dashed #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Tu futuro link público:</p>
              <a href="https://bios.creatuimagen.online/${slug}" target="_blank" style="font-size: 16px; font-weight: 800; color: #2563eb; text-decoration: none;">bios.creatuimagen.online/${slug}</a>
            </div>
          </div>

          <a href="https://wa.me/525555027042?text=${waEncoded}" 
             style="display: block; background: #f8fafc; color: #2563eb; padding: 15px; border-radius: 16px; text-decoration: none; text-align: center; font-weight: bold; font-size: 14px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
            💬 Hablar con soporte por WhatsApp
          </a>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">¿Alguna duda? Escríbenos por WhatsApp o responde a este correo.</p>
            <p style="font-size: 12px; color: #cbd5e1; margin-top: 10px; font-weight: bold;">CREA TU IMAGEN ONLINE</p>
          </div>
        </div>
      `,
    });


    return { success: true, data };
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return { success: false, error };
  }
}

export async function sendAdminNotification({ nombre, slug, email, whatsapp, unit = 'BIOS' }: { nombre: string, slug: string, email: string, whatsapp?: string, unit?: BusinessUnit }) {
  try {
    const { client, from } = getResendClient(unit);
    let finalWhatsApp = null;
    if (whatsapp) {
      const clean = whatsapp.replace(/\D/g, ''); // Solo números
      if (whatsapp.trim().startsWith('+')) {
        finalWhatsApp = clean; // Ya tiene código de país
      } else if (clean.length === 10) {
        finalWhatsApp = `52${clean}`; // Es México sin código
      } else {
        finalWhatsApp = clean; // Asumimos que ya tiene código
      }
    }
    const waLink = finalWhatsApp ? `https://wa.me/${finalWhatsApp}` : null;
    
    await client.emails.send({
      from: from,
      to: 'creandovalor.ia@gmail.com',
      replyTo: 'arturo.barrios@bios.creatuimagen.online',
      subject: `💰 ¡Nueva Venta! - ${nombre}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">¡Nueva Venta Confirmada! 💰</h2>
          <p><b>Producto:</b> Bio Digital (${unit})</p>
          <p><b>Cliente:</b> ${nombre}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>WhatsApp:</b> ${whatsapp || 'No proporcionado'}</p>
          <p><b>URL Reservada:</b> bios.creatuimagen.online/${slug}</p>
          
          ${waLink ? `
            <a href="${waLink}" style="display: inline-block; background: #25d366; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 10px;">
              Hablar por WhatsApp ahora
            </a>
          ` : ''}
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #999;">Notificación automática de Crea Tu Imagen Online</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error enviando notificación admin:', error);
  }
}

export async function sendAbandonmentNotification({ nombre, slug, email, whatsapp, unit = 'BIOS' }: WelcomeEmailProps) {
  try {
    const { client, from } = getResendClient(unit);
    let finalWhatsApp = null;
    if (whatsapp) {
      const clean = whatsapp.replace(/\D/g, '');
      if (whatsapp.trim().startsWith('+')) {
        finalWhatsApp = clean;
      } else if (clean.length === 10) {
        finalWhatsApp = `52${clean}`;
      } else {
        finalWhatsApp = clean;
      }
    }
    const waLink = finalWhatsApp ? `https://wa.me/${finalWhatsApp}` : null;
    
    await client.emails.send({
      from: from,
      to: 'creandovalor.ia@gmail.com',
      replyTo: 'arturo.barrios@bios.creatuimagen.online',
      subject: `⚠️ Intento de compra - ${nombre}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f59e0b;">⚠️ Carrito Abandonado / Intento de pago</h2>
          <p>El cliente inició el proceso de pago pero aún no lo ha completado.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><b>Cliente:</b> ${nombre}</p>
          <p><b>WhatsApp:</b> ${whatsapp || 'No proporcionado'}</p>
          <p><b>Email:</b> ${email}</p>
          
          ${waLink ? `
            <p>Escríbele para ver si necesita ayuda:</p>
            <a href="${waLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: bold;">
              Contactar por WhatsApp
            </a>
          ` : ''}
        </div>
      `,
    });
  } catch (error) {
    console.error('Error enviando notificación de abandono:', error);
  }
}
