# 📝 Reglas de Negocio — Plataforma Crea Tu Imagen Bio
## Presencia Digital Automática, Inteligencia de Ventas y Soporte Resiliente

Este documento recopila las directrices lógicas, automatizaciones y reglas operativas construidas para el ecosistema de **Crea Tu Imagen Bio** (`bios.creatuimagen.online`). 

---

## 1. Validación de Correos y Prevención de Errores de Registro (Frontend)
El registro de un cliente es la puerta de entrada al SaaS. Para evitar que un usuario escriba mal su correo (typos) e inhabilite sus accesos automáticos:
* **Detector Interactivo de Typos (Tiempo Real):** A medida que el usuario escribe en el formulario de registro (`app/registro/page.tsx`), un algoritmo de análisis heurístico busca dominios con errores comunes (como `gmai.com`, `gamil.com`, `hotmai.com`, `outloo.com`, `arturobarriosi.com`).
* **Sugerencia de Corrección:** Si se detecta un typo, se muestra una tarjeta ámbar interactiva que sugiere el correo corregido (ej: *"¿Quisiste decir usuario@gmail.com? Haz clic aquí"*).
* **Bloqueo Físico en Submit:** Si el usuario ignora la alerta e intenta presionar "Pagar", la función congela el envío, bloquea la redirección a Mercado Pago y lanza una alerta flotante obligándolo a corregir el correo.

---

## 2. Automatización de Ventas y Alta del Cliente (Mercado Pago Webhook)
Cuando un pago de $950 MXN es aprobado en Mercado Pago:
* **Detección Dinámica de Entornos:** El webhook en `/api/webhook/route.ts` procesa el pago usando el token correcto en caliente (Producción o Sandbox según la variable `MP_SANDBOX_MODE`).
* **Estrategia CRM (Aislamiento de Ventas):** La venta y los leads se registran en el esquema privado `crm` de Supabase (`crm.clientes` y `crm.ventas`). Esto permite borrar o resetear la aplicación sin perder el historial de facturación ni la base de clientes.
* **Onboarding Automatizado Sin Fricciones:**
  1. Se crea un usuario en Supabase Auth (`auth.users`) utilizando una contraseña temporal automática legible pero segura con el patrón `Crea*[4_dígitos_aleatorios]`.
  2. Se marca `email_confirm: true` para que la cuenta se active al instante de forma transparente.
  3. Se inserta su perfil correspondiente en `public.perfiles` con su slug único y se enlaza al CRM.
* **Notificación de Bienvenida:** Se envía un correo transaccional estilizado con Resend al buzón del cliente entregándole sus accesos y su enlace temporal.
* **Alerta al Administrador (Verde):** Se envía un correo de notificación de venta exitosa a `creandovalor.ia@gmail.com` detallando el monto, el cliente y un botón pre-rellenado de WhatsApp para saludarlo.

---

## 3. Monitoreo de Entregabilidad y Gestión de Rebotes (Resend Webhook)
Si el correo de bienvenida no llega a entregarse (rebote) o es marcado como spam:
* **Firma Criptográfica Segura:** Resend notifica a nuestro webhook en `/api/resend-webhook/route.ts` firmando los payloads mediante cabeceras `svix` validadas contra `RESEND_WEBHOOK_SECRET`.
* **Identificación Automática del Cliente:** Al recibir un evento `email.bounced` o `email.complained`, el webhook consulta la base de datos Supabase usando la clave maestra `service_role` para buscar qué perfil corresponde al correo fallido.
* **Alerta de Soporte Proactiva (Roja):** Si se encuentra al cliente, se envía un correo de alerta roja urgente al administrador (`creandovalor.ia@gmail.com`) con:
  * El nombre real del cliente y su enlace `/slug`.
  * La descripción técnica del error del servidor receptor.
  * **Botón Verde de WhatsApp Directo:** Un botón pre-configurado que abre WhatsApp Web o App apuntando al teléfono del cliente e inyectando un mensaje de soporte personalizado que incluye el correo erróneo:
    > *"Hola [Nombre], notamos un inconveniente con el correo electrónico ([correo_incorrecto]) registrado para tu Bio digital de Crea Tu Imagen. Queremos ayudarte a configurarlo de inmediato."*

---

## 4. Permisos, Seguridad y Bypass de RLS para el Administrador
Para garantizar el aislamiento de datos entre clientes pero permitir al administrador gestionar toda la plataforma:
* **Políticas RLS en Supabase:** La base de datos protege las tablas `perfiles`, `contactos_vcf` y `perfil_links` de modo que un usuario autenticado estándar solo puede leer y escribir su propia información (`auth.uid() = user_id`).
* **Endpoints Privados para Admin (Bypass Seguro):** Cuando el administrador general (`creandovalor.ia@gmail.com`) accede a la página de edición de un cliente (`/admin/perfiles/[slug]`), el sistema activa los endpoints `/api/admin/update-profile` y `/api/admin/links`.
* **Seguridad de Servidor:** Estos endpoints validan en backend la identidad de la sesión activa en el servidor y, si es el administrador maestro, procesan las peticiones usando el cliente `getSupabaseAdmin()` (que evade el RLS de forma segura mediante la firma `service_role`).
* **Aislamiento Visual:** Los inquilinos o clientes nunca ven los botones de infraestructura, logs ni herramientas del sistema. Solo se renderizan si el usuario logueado es `creandovalor.ia@gmail.com`.

---

## 5. Integridad de Datos e Índices Únicos
* **Tratamiento del Dominio Personalizado (`custom_domain`):** La columna `custom_domain` en Supabase tiene una restricción de valor único (`UNIQUE`).
* **Neutralización de Colisiones:** Para evitar que la base de datos aborte el guardado al registrar múltiples perfiles sin dominio (lo cual enviaría cadenas de texto vacías `""` colisionando entre sí), el frontend convierte automáticamente todo dominio vacío a `null` antes de enviarlo a la API. Esto permite que coexistan infinitos perfiles sin dominio personalizado sin violar la restricción única.

---
© 2026 Creando Valor IA
