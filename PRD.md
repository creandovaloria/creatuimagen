# PRD - Crea Tu Imagen Platform (Multi-tenant SaaS)

## 🎯 Visión del Proyecto
Transformar "Crea Tu Imagen" en una plataforma SaaS escalable donde se pueden gestionar múltiples tipos de servicios digitales bajo una sola infraestructura centralizada, utilizando subdominios y dominios personalizados.

## 🏗️ Arquitectura de Ruteo
El sistema utiliza un **Middleware de Next.js** para interceptar peticiones y servirlas según el subdominio o dominio:

- **Dominio Raíz (`creatuimagen.online`):** Página principal y Landing.
- **Subdominio Bios (`bios.creatuimagen.online`):** Perfiles personales y tarjetas VCF.
- **Subdominio Eventos (`eventos.creatuimagen.online`):** Invitaciones digitales.
- **Dominios Personalizados (`lilianachaglla.com`):** Mapeo transparente a perfiles específicos.

## 🛠️ Stack Tecnológico
- **Frontend:** Next.js (App Router) + Tailwind CSS.
- **Backend/Auth:** Supabase.
- **Infraestructura:** Vercel.
- **Base de Datos:** PostgreSQL (vía Supabase).

## ✅ Características Implementadas (Fase 2: SaaS & CRM)
1. **CRM Maestro (Esquema `crm`):** Aislamiento de datos de clientes y ventas de la lógica operativa.
2. **Inteligencia de Ventas:** Registro cualitativo de cierres (Título conceptual, psicología del cliente).
3. **Analíticas Internas:** Contador de visitas real-time y detección de origen (Referer Tracking) para medir tráfico de IG, FB, WA.
4. **UX Internacional:** Registro con selector de banderas y normalización automática de números globales.
5. **Automatización de Webhooks:** Integración con Mercado Pago que activa CRM + Emails + Perfiles en un solo flujo.
6. **Onboarding Sin Fricción:** Creación automática de usuarios en Supabase Auth con contraseña temporal auto-confirmada entregada directamente en el correo de bienvenida unificado (Resend), eliminando correos de sistema confusos y ajenos.

---

## 🚀 Próximos Pasos
1. **Dashboards para Clientes:** Permitir que los dueños de las Bios vean sus propias analíticas de tráfico.
2. **Módulo de Ventas Manuales:** Interfaz para registrar pagos fuera de Mercado Pago (efectivo, PayPal).
3. **Automatización de Renovaciones:** Sistema de alertas para perfiles por expirar.
