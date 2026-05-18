// Script para consultar el saldo de la cuenta de BIOS usando el endpoint oficial de Mercado Pago
const ACCESS_TOKEN = 'APP_USR-6795360745009030-051221-146ba117193fc661a7d28a55ba16fcc5-3355880913';
const USER_ID = '3355880913';

async function checkBalance() {
  console.log('🔍 Consultando saldo de tu cuenta comercial de BIOS en Mercado Pago...');
  
  try {
    const response = await fetch(`https://api.mercadopago.com/users/${USER_ID}/mercadopago_account/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ Error en la API de Saldo (Status ${response.status}):`, await response.text());
      return;
    }

    const balance = await response.json();
    console.log('========================================================================');
    console.log('💰 CONSULTA DE SALDO REAL EN MERCADO PAGO:');
    console.log('========================================================================');
    console.log(`🔹 Saldo Total:       \x1b[32m$${balance.total_amount} ${balance.currency_id}\x1b[0m`);
    console.log(`🔹 Saldo Disponible:  \x1b[36m$${balance.available_amount} ${balance.currency_id}\x1b[0m (Listo para retirar/usar)`);
    console.log(`🔹 Saldo No Disponible:\x1b[33m$${balance.unavailable_amount} ${balance.currency_id}\x1b[0m (Retenido temporalmente)`);
    console.log('========================================================================');
    
  } catch (error) {
    console.error('💥 Error fatal al consultar saldo:', error);
  }
}

checkBalance();
