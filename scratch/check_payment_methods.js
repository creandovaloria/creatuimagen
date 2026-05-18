// Script para consultar y auditar los medios de pago activos en Mercado Pago con tu Access Token real de BIOS
const ACCESS_TOKEN = 'APP_USR-6795360745009030-051221-146ba117193fc661a7d28a55ba16fcc5-3355880913';

async function checkPaymentMethods() {
  console.log('🔍 Consultando medios de pago activos para tu cuenta de BIOS en Mercado Pago...');
  
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ Error en la API (Status ${response.status}):`, await response.text());
      return;
    }

    const methods = await response.json();
    console.log(`📦 Se encontraron ${methods.length} medios de pago en total para tu cuenta.\n`);

    methods.forEach(m => {
      console.log(`🔹 ID: \x1b[36m${m.id}\x1b[0m`);
      console.log(`   Nombre: \x1b[1m${m.name}\x1b[0m`);
      console.log(`   Categoría: ${m.payment_type_id}`);
      console.log(`   Estatus: ${m.status === 'active' ? '🟢 \x1b[32mACTIVO\x1b[0m' : '🔴 INACTIVO'}`);
      console.log(`   Rango permitido: $${m.min_allowed_amount} a $${m.max_allowed_amount} MXN`);
      console.log(`   Tiempo de acreditación: ${m.accreditation_time === 0 ? '⚡ Instantáneo' : `${m.accreditation_time} min`}`);
      console.log('------------------------------------------------------------------------');
    });
    
  } catch (error) {
    console.error('💥 Error fatal al consultar API:', error);
  }
}

checkPaymentMethods();
