import { MercadoPagoConfig } from 'mercadopago';

/**
 * Gestor de Credenciales de Mercado Pago por Unidad de Negocio
 */
export type BusinessUnit = 'BIOS' | 'EVENTOS' | 'ARTURO';

export function getMercadoPagoClient(unit: BusinessUnit = 'BIOS') {
  // Trigger clean Vercel deployment with updated environment variables
  // Evitar errores durante el build de Next.js
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.MP_ACCESS_TOKEN && !process.env.MP_BIOS_ACCESS_TOKEN) {
    return new MercadoPagoConfig({ accessToken: 'dummy' });
  }

  let accessToken = '';

  switch (unit) {
    case 'BIOS':
      accessToken = process.env.MP_BIOS_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '';
      break;
    case 'EVENTOS':
      accessToken = process.env.MP_EVENTOS_ACCESS_TOKEN || '';
      break;
    case 'ARTURO':
      accessToken = process.env.MP_ARTURO_ACCESS_TOKEN || '';
      break;
  }

  return new MercadoPagoConfig({ accessToken });
}
