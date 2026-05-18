# Crea Tu Imagen - Platform

Plataforma SaaS Multi-tenant para la gestión de perfiles digitales (`bios`) e invitaciones (`eventos`).

## 🚀 Guía de Operación (Admin)

### Acceso al Panel
- **URL:** `https://bios.creatuimagen.online/admin`
- **Login:** Requiere credenciales de administrador autorizadas en Supabase.

### Cómo dar de alta un nuevo Cliente con Dominio Propio
1. **En Supabase:** Crear el perfil en la tabla `perfiles` y definir un `slug` (ej: `nombre-apellido`).
2. **En Vercel:** 
   - Ir al proyecto `creatuimagen-platform`.
   - Settings -> Domains -> Add.
   - Añadir el dominio del cliente (ej: `cliente.com`).
3. **En el Código:**
   - Abrir `middleware.ts`.
   - Añadir el mapeo en `customDomainMap`: `'cliente.com': 'slug-de-supabase'`.
   - Hacer `git push`.

## 🛠️ Desarrollo Local

1. Instalar dependencias: `npm install`
2. Configurar `.env.local` con las llaves de Supabase.
3. Correr dev server: `npm run dev`

## 🔐 Seguridad y Auth
- Las contraseñas de administrador deben ser gestionadas cuidadosamente.
- **Onboarding Automático:** Al registrarse vía pago, se crea automáticamente un usuario en Supabase Auth con una contraseña temporal auto-confirmada (ej: `Crea*XXXXXX`). Esta clave se entrega directamente en el email de bienvenida del cliente de forma transparente y sin correos genéricos del sistema.
- El cliente final puede iniciar sesión inmediatamente con su correo y contraseña temporal, y posteriormente cambiarla en su panel de administración o solicitar restablecimiento vía correo.
- **IMPORTANTE:** No crear usuarios con correos inexistentes para evitar bloqueos de Supabase por rebotes de email.

## 📊 Centro de Ventas & CRM
La plataforma incluye un sistema de Inteligencia de Ventas (CRM) accesible en `/admin/ventas`.

- **Maestro de Clientes:** Centralización de identidad por email.
- **Inteligencia Comercial:** Registro cualitativo de cierres (Psicología de venta).
- **Analíticas:** Contador de visitas por perfil y rastreo de origen (Instagram, Facebook, WhatsApp).

## 🕵️‍♂️ Rastreo de Tráfico
El sistema detecta automáticamente la procedencia de los visitantes mediante la cabecera `Referer`:
- **Directo:** Tráfico desde WhatsApp o acceso directo al navegador.
- **Instagram/Facebook/TikTok:** Identificación de tráfico desde redes sociales.
- **Google:** Tráfico orgánico de búsqueda.

## 🧪 Pruebas de Integración
Para validar el flujo completo sin realizar pagos reales, se puede usar el script:
```bash
node scratch/test_final_saas.js
```
*Nota: Este script usa un bypass de seguridad (`TEST_PAYMENT`) habilitado solo para el administrador.*

---
© 2026 Creando Valor IA
