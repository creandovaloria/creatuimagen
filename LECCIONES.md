# 📚 Lecciones Aprendidas
# creatuimagen.online — Plataforma de Presencia Digital

---

## 🏗 Decisiones de arquitectura

### ✅ Next.js > HTML puro para producción
HTML puro tiene fricciones en Vercel: routing manual, sin serverless functions, sin caché.
Next.js es serverless por default — zero config, rutas automáticas, build optimizado.

### ✅ Cloudinary > base64 para imágenes
Base64 = parche para prototipos locales. En producción: Cloudinary con URL pública + CDN.
HTML de 50KB vs 1.4MB. Lazy loading, optimización automática por dispositivo.

### ✅ SoundCloud Widget API > YouTube IFrame para música
YouTube error 150 = video bloqueado para embedding por el artista.
SoundCloud Widget API via postMessage funciona sin restricciones.
Usar `SC.Widget(iframe)` con el SDK cargado dinámicamente.

### ✅ Un solo repo, múltiples subdominios
`invitaciones.creatuimagen.online` vive en `creandovaloria/creatuimagen-platform`.
Vercel maneja múltiples dominios por proyecto sin costo extra.

### ✅ Serverless Functions para lógica sensible
Credenciales NUNCA en el HTML. El HTML solo conoce la URL de la API.

---

## 🐛 Errores y soluciones

### Error 1 — Imágenes no visibles en navegador
**Causa:** Rutas `/mnt/user-data/uploads/` no accesibles desde browser.
**Solución prod:** Cloudinary con URL pública.
**Solución prototipo:** base64 embebido.

### Error 2 — Countdown encimado sobre imagen
**Causa:** `position: absolute` sobre imagen del calendario.
**Solución:** Construir calendario en HTML/CSS y countdown como elemento de flujo normal debajo.

### Error 3 — 404 en Vercel con HTML estático
**Causa:** `vercel.json` con `@vercel/static` no funciona correctamente.
**Solución:** Next.js desde el inicio — zero config routing.

### Error 4 — Play/pause toggle desincronizado
**Causa:** Variable local `isPlaying` no refleja estado real del player.
**Solución:** `player.getPlayerState() === 1` directamente.

### Error 5 — Repo con carpetas de otros proyectos
**Causa:** Repo `invitaciones` ya tenía contenido previo.
**Solución:** Repo nuevo `creatuimagen-platform` dedicado.

### Error 6 — Token GitHub en el chat
**Riesgo:** Tokens en texto plano. Revocar después de cada sesión.

### Error 7 — Imágenes cortadas en hero section
**Causa:** `object-cover` + altura fija recorta imágenes.
**Solución:** NO usar altura fija. Dejar proporción natural. Usar ScrollHint para indicar scroll.

### Error 8 — YouTube error 150 → RESUELTO con SoundCloud
**Causa:** Icona Pop bloquea embedding en YouTube (error 150).
**Solución:** SoundCloud Widget API. Track oficial Big Beat Records.
**URL:** `https://soundcloud.com/wearebigbeat/icona-pop-i-love-it-feat-charli-xcx`
**Implementación:** iframe oculto + `SC.Widget(iframe)` + bind READY/PLAY/PAUSE/FINISH.

### Error 9 — **Multi-tenancy:** Soporte para dominios personalizados (SaaS) y subdominios específicos (`bios.`, `eventos.`).
- **Middleware Robusto:** Ruteo dinámico basado en el hostname para servir el perfil correcto sin cambiar la URL del usuario.
- **Admin Panel Pro:** Interfaz mejorada para gestión de colores, fotos y enlaces dinámicos con soporte de protocolos automáticos.
- **Seguridad:** Autenticación centralizada mediante Supabase Auth con roles de administrador protegidos.

### Error 10 — Primer click no reproduce en iOS/iPadOS
**Causa:** Safari requiere user gesture directo. postMessage no cuenta.
**Solución:** `pendingPlay` ref — si el usuario clickea antes del READY event, se reproduce automáticamente al disparar READY.

---

## 🎯 Prompts óptimos

### Para nueva invitación
```
Crea un componente Next.js mobile-first para invitación digital de [tipo].
Stack: Next.js 14 App Router, Tailwind CSS, Cloudinary para imágenes.

Datos:
- Festejado/a: [nombre]
- Fecha: [fecha ISO]
- Lugar: [nombre + dirección] o porDefinir=true
- Canción: [canción] — SoundCloud URL: [url]
- RSVP WhatsApp: [número] — Mensaje: [texto]
- Imágenes Cloudinary: [URLs por sección]
- Secciones: intro → música → calendario+countdown → fotos → dresscode → lugar → rsvp → footer

Animaciones: pétalos CSS, scroll reveal, ecualizador cuando suena música.
Footer: "arturobarrios.com · Liz Barron Event Planner"
Sin base64. Sin HTML puro. Componentes React separados.
```

---

## 🚀 Stack de producción

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Framework | Next.js 14 App Router | ✅ |
| Hosting | Vercel (Creando Valor IA) | ✅ |
| Repo | creandovaloria/creatuimagen-platform | ✅ |
| Dominio | invitaciones.creatuimagen.online | ✅ |
| Imágenes | Cloudinary (dl66zeuix) | ✅ |
| Música | SoundCloud Widget API | ✅ |
| Base de datos | Supabase | 🔜 |
| Pagos | Stripe | 🔜 |
| WhatsApp | Meta Business API | 🔜 |

---

## 📐 Cloudinary — Cloud: dl66zeuix

### XV-Regina
| Imagen | URL |
|--------|-----|
| intro | `f_auto,q_auto/v1778143812/1.1_1_Intro_qw3b4e.png` |
| musica | `f_auto,q_auto/v1778144448/1.1_2_Reproductor_buyhad.png` |
| collage | `f_auto,q_auto/v1778145447/1.1_4_Collage_Polaroid_fupy5g.png` |
| tira | `f_auto,q_auto/v1778145084/1.1_6_Tira_mkxcnh.jpg` |
| flamingo | `f_auto,q_auto/v1778145782/1.1_7_Flamingo_gpdtsc.png` |
| restaurante | pendiente |

Base URL: `https://res.cloudinary.com/dl66zeuix/image/upload/`

---

## 🗓 Evento XV Regina
- **Fecha:** 6 de Junio 2026, 4:00 pm
- **Lugar:** Por definir
- **RSVP:** Liz Barron +524272199374
- **URL:** invitaciones.creatuimagen.online/XV-Regina
- **Canción:** I Love It — Icona Pop ft. Charli XCX

---

## 🏗️ Decisiones de arquitectura — Escalabilidad

### Decisión 10 — Datos del planner en Supabase, no en env vars
**Problema:** Email y teléfono de Liz Barron estaban en variables de entorno (`LIZ_EMAIL`, `LIZ_PHONE`).  
**Por qué es malo:** Para cada nuevo evento habría que agregar nuevas env vars en Vercel. No escala.  
**Solución:** Los datos del planner van en la tabla `eventos` de Supabase:
```sql
eventos.planner_nombre
eventos.planner_email
eventos.planner_phone
```
**Beneficio:** Para un nuevo evento solo se inserta un registro en Supabase. Sin tocar código ni Vercel.

### Decisión 11 — Twilio → Meta WhatsApp Business API
**Problema:** Se había planificado Twilio para WhatsApp.  
**Razón del cambio:** El cliente ya tiene cuenta de Meta Business verificada.  
**Beneficio:** Sin costo adicional de Twilio, integración directa con la cuenta existente.  
**Implementación:**
```typescript
// Meta Graph API v19.0
POST https://graph.facebook.com/v19.0/{META_PHONE_ID}/messages
Authorization: Bearer {META_WA_TOKEN}
{ messaging_product: 'whatsapp', to: '521234567890', type: 'text', text: { body: msg } }
```

### Decisión 12 — Email desde dominio invitaciones.arturobarrios.com
**Razón:** Plan gratuito de Resend permite 1 dominio. Ya estaba verificado `invitaciones.arturobarrios.com`.  
**From:** `hola@invitaciones.arturobarrios.com`  
**Cuando escale:** Agregar `creatuimagen.online` en plan Pro de Resend (~$20 USD/mes).

### Decisión 13 — Variables de entorno mínimas (solo 5)
**Variables reales en Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
RESEND_API_KEY
META_WA_TOKEN
META_WA_PHONE_ID
```
Todo lo demás (planner, festejado, fecha, lugar) viene de Supabase. Sin hardcodear nada.

---

## 🐛 Troubleshooting — Vercel deployments

### 📧 Gestión de Reputación de Email y Auth
- **Lección:** No usar correos ficticios (`@creatuimagen.online`) en Supabase Auth.
- **Impacto:** Supabase detecta los rebotes y puede suspender los privilegios de envío de correos del proyecto.
- **Solución:** Usar siempre correos reales para administradores y configurar un proveedor SMTP externo (como Resend) lo antes posible para producción.

### 🌐 Arquitectura Multi-tenant en Vercel
- **Lección:** Un proyecto en Vercel puede manejar múltiples dominios, pero cada uno debe ser añadido manualmente o vía API a la lista de dominios del proyecto.
- **Impacto:** Si un dominio apunta al DNS de Vercel pero no está en la lista del proyecto, devolverá un error 404 genérico de Vercel.
- **Solución:** Centralizar todos los dominios en la "Nave Nodriza" (proyecto principal) y dejar que el Middleware haga el ruteo interno.

### 🔗 Protocolos en Enlaces Dinámicos
- **Lección:** Los navegadores interpretan links sin `https://` como rutas internas.
- **Impacto:** Al hacer clic en un botón de red social, el usuario era enviado a `bios.creatuimagen.online/linkedin.com/...` causando un 404.
- **Solución:** Implementar una función sanitizadora (`ensureExternalLink`) que fuerce el protocolo en todos los enlaces externos.

### Error 10 — Múltiples deployments en error por Supabase
**Causa:** La API route `/api/rsvp` intentaba conectar a Supabase en build time, pero las env vars no estaban configuradas en Vercel.  
**Síntoma:** 10+ deployments en rojo consecutivos.  
**Solución:** Cliente de Supabase lazy-loaded — solo se inicializa en runtime cuando llega una request, no en build time.
```typescript
let _supabase: SupabaseClient | null = null
function getSupabase() {
  if (_supabase) return _supabase
  // Solo se ejecuta cuando hay una request real
  _supabase = createClient(url, key)
  return _supabase
}
```
**Prevención:** Agregar las env vars en Vercel ANTES de hacer el primer deploy con Supabase.

### Error 11 — Build local exitoso pero Vercel en error
**Causa frecuente:** Archivo nuevo creado localmente pero no incluido en el push a GitHub.  
**Síntoma:** `Module not found` en Vercel, pero localmente compila sin problemas.  
**Solución:** Verificar con `repo.get_contents()` que el archivo existe en el repo antes de continuar.  
**Prevención:** Al crear un archivo nuevo, subirlo a GitHub inmediatamente.

### Error 12 — YouTube error 150 en reproductor de música
**Causa:** Icona Pop tiene embedding deshabilitado en todos sus videos de YouTube.  
**Síntoma:** El player se inicializa (`YT Player ready ✅`) pero al reproducir aparece `YT Error: 150`.  
**Solución:** Migrar a SoundCloud Widget API.
```typescript
// SoundCloud Widget SDK
widget = SC.Widget(iframeRef)
widget.bind(SC.Widget.Events.READY, () => setReady(true))
widget.play() // funciona en iOS y Android
```
**Aprendizaje:** Antes de implementar, verificar si el video permite embed en `youtube.com/embed/{ID}`.

---

## 🗃️ Sesión — Supabase Storage para fotos de perfil (Mayo 2026)

### Decisión 14 — Supabase Storage > Cloudinary para fotos de perfil
**Problema:** Cloudinary era el plan original, pero para el módulo Bio los avatares son simples JPGs.  
**Solución:** Supabase Storage (bucket `avatars`) — ya incluido en el free tier, sin dependencia externa.  
**Beneficio:** Sin API key adicional, mismo cliente que la BD, URL pública directa.  
**Aprendizaje:** No sobre-ingeniear. Cloudinary tiene sentido para invitaciones (transformaciones, CDN). Para avatares simples, Supabase Storage es suficiente.

### Decisión 15 — Límite de archivo por variable de entorno
**Problema:** El free tier de Supabase tiene límite de storage (500MB).  
**Solución:** Validar el peso del archivo en cliente con `NEXT_PUBLIC_MAX_UPLOAD_MB` antes del upload.
```typescript
const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 2)
if (file.size > maxMb * 1024 * 1024) {
  setMessage(`❌ La imagen pesa más de ${maxMb}MB`)
  return
}
```
**Aprendizaje:** Los límites de negocio van en variables de entorno, nunca hardcodeados.

### Decisión 16 — Campo `usa_colores_tema` para toggle de colores sociales
**Problema:** Clientes quieren elegir entre íconos con colores corporativos (Instagram rosa, LinkedIn azul) o íconos monocromáticos con su color de tema.  
**Solución:** Campo boolean en la tabla `perfiles`. `false` (default) = colores reales de la marca. `true` = usa `theme_primary`.  
**Aprendizaje:** El default debe ser el que requiere menos acción del usuario. Los colores corporativos son más reconocibles, así que van de default.

---

## 🐛 Errores y soluciones — Sesión Mayo 2026

### Error 13 — RLS bloqueando subida de fotos
**Síntoma:** `❌ new row violates row-level security policy`  
**Causa:** El bucket `avatars` existía pero no tenía políticas RLS para INSERT/UPDATE.  
**Solución:** Crear políticas en Supabase SQL Editor:
```sql
CREATE POLICY "Permitir subida a avatars" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Permitir actualizar avatars" 
ON storage.objects FOR UPDATE 
TO public 
WITH CHECK (bucket_id = 'avatars');
```
**Prevención:** Al crear un bucket nuevo, crear las 3 políticas (INSERT, UPDATE, SELECT) de inmediato.

### Error 14 — Tarjeta pública completamente blanca
**Síntoma:** La página `bio.creatuimagen.online/[slug]` cargaba sin datos (todo en blanco).  
**Causa:** Desconexión entre los campos que retorna Supabase y las props que esperaba `ProfileCard`.  
**Solución:** Pasar el objeto completo de Supabase directamente:
```typescript
// ❌ Mal — mapeo parcial que pierde campos
<ProfileCard nombre={perfil.nombre} foto={perfil.foto_url} />

// ✅ Bien — pasar el objeto completo
<ProfileCard profile={{ ...perfil, links, vcf }} />
```

### Error 15 — Checkbox no actualizaba el estado del formulario
**Síntoma:** El campo `usa_colores_tema` no guardaba su valor al hacer submit.  
**Causa:** `handleChange` usaba `e.target.value` para todos los inputs, pero los checkboxes exponen el estado en `e.target.checked`.  
**Solución:**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const target = e.target;
  const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
  setFormData(prev => ({ ...prev, [target.name]: value }))
}
```

### Error 16 — Renombrado de columna SQL sin perder datos
**Situación:** Se creó la columna con el nombre `usa_colores_originales` y luego se decidió renombrarla a `usa_colores_tema`.  
**Solución correcta:** Usar RENAME COLUMN en lugar de DROP + ADD (que perdería datos):
```sql
-- ✅ Correcto — preserva datos
ALTER TABLE perfiles RENAME COLUMN usa_colores_originales TO usa_colores_tema;

-- ❌ Incorrecto — pierde datos
ALTER TABLE perfiles DROP COLUMN usa_colores_originales;
ALTER TABLE perfiles ADD COLUMN usa_colores_tema BOOLEAN DEFAULT false;
```

---

## 🚀 Sesión — Automatización de Ventas y SaaS (12 Mayo 2026)

### Decisión 17 — Arquitectura de Pagos Multicuenta
**Problema:** Usar una sola cuenta de Mercado Pago para diferentes unidades de negocio confunde al cliente en su recibo bancario.  
**Solución:** Implementar un gestor inteligente (`lib/mercadopago.ts`) que selecciona el `AccessToken` según la unidad (`BIOS`, `EVENTOS`, `ARTURO`).  
**Aprendizaje:** El orden financiero desde el inicio facilita la escalabilidad y reduce reclamos.

### Decisión 18 — Email Transaccional (Resend) vs Marketing
**Lección:** Para notificaciones críticas (links de acceso, recibos), usar servicios transaccionales.  
**Configuración:** Verificamos que Resend es la herramienta ideal por su alta entregabilidad y facilidad de integración con Next.js.  
**Mejora:** Tradujimos los remitentes a español (`bienvenida@`, `ventas@`) para mejorar la UX.

### Error 17 — Build Error: "supabaseKey is required" en Vercel
**Síntoma:** Los deployments fallan sistemáticamente con errores de Supabase o Mercado Pago durante el Build.  
**Causa:** Next.js intenta pre-renderizar rutas de API que dependen de variables de entorno no disponibles en build time.  
**Solución:** Forzar ejecución dinámica en las rutas de API/Webhooks:
```typescript
export const dynamic = 'force-dynamic';
```
**Prevención:** Todas las rutas de Webhooks y Checkouts deben llevar esta bandera por seguridad.

### Decisión 19 — Documentación de Accesos Privada (`ACCESOS.md`)
**Lección:** Tener una matriz de credenciales (Servicio, Cuenta, Env Var) es vital pero peligroso.  
**Solución:** Crear un archivo local `ACCESOS.md` y añadirlo inmediatamente al `.gitignore`.  
**Beneficio:** El desarrollador tiene un mapa claro de la infraestructura sin comprometer la seguridad del repositorio.

### Decisión 20 — El Laberinto de Mercado Pago (Webhooks)
**Problema:** El dashboard general de Mercado Pago entra en bucles infinitos y oculta la configuración de Webhooks.  
**Solución:** Se descubrió que la única forma infalible de acceder a la edición de la App (y sus Webhooks) es vía la URL directa del panel de developers usando el ID de la aplicación:  
`https://www.mercadopago.com.mx/developers/panel/app/[APP_ID]/edit-app`  
**Aprendizaje:** Guardar siempre el ID de la aplicación (`6795360745009030` en este caso) para saltar directo a la configuración técnica.

---

### Decisión 21 — Arquitectura de Correos Multi-Unidad (Resend)
**Problema:** La plataforma soporta múltiples líneas de negocio (Bios, Eventos, Personal) que requieren remitentes y credenciales distintas.  
**Solución:** Implementar un gestor en `lib/email.ts` que selecciona la API Key basándose en la `BusinessUnit`.
**Variables Clave:** 
- `RESEND_BIOS_CREA_TU_IMAGEN_API_KEY`: Para la unidad de Bios.
- `RESEND_ARTURO_API_KEY`: Para la unidad personal.
**Aprendizaje:** Usar siempre **subdominios** (ej: `mail.bios.creatuimagen.online`) para proteger la reputación del dominio principal y configurar el `replyTo` hacia Zoho para centralizar la atención al cliente.

---

### Decisión 22 — Base de Datos Centralizada (Estrategia CRM)
**Decisión:** A diferencia de los emails o pagos, la base de datos de Supabase **no se separa por unidad de negocio**.  
**Razón:** Consolidar todos los leads, perfiles y transacciones en una sola base de datos permite construir un **CRM unificado** en el futuro. Esto facilita el análisis de datos cruzados y simplifica la infraestructura (solo se requiere un set de variables `NEXT_PUBLIC_SUPABASE_URL` y `SERVICE_ROLE_KEY`).  
**Beneficio:** Escalabilidad administrativa y visión 360 del cliente desde un solo panel.

---

## 🛠️ Troubleshooting & Debugging

### Error 500 en Webhooks (IDs de Prueba)
- **Síntoma:** El simulador de Mercado Pago devuelve "500 Internal Server Error".
- **Causa:** El servidor intenta consultar a la API de Mercado Pago por un ID de pago inexistente o de prueba (ej: `123456`) y el SDK lanza una excepción al no encontrarlo.
- **Solución:** Envolver la consulta `payment.get()` en un bloque `try/catch`. Si el pago no existe, el servidor debe responder con un **200 OK** (indicando que la notificación fue recibida) pero sin procesar ninguna acción de base de datos o email.
- **Lección:** Los Webhooks deben ser "resilientes" a datos basura o de prueba para evitar bloqueos en las herramientas de integración.

---

### Decisión 23 — Sincronización DB-Código (Best Practices)
**Problema:** Los errores "400 Bad Request" ocurren cuando el código intenta insertar datos en columnas inexistentes o faltan campos obligatorios.  
**Solución:**
1.  **Tipado Estricto:** Usar Supabase CLI para generar tipos de TypeScript automáticamente. Esto evita errores de dedo (ej: `primary_color` vs `theme_primary`).
2.  **Valores por Defecto:** Configurar valores `DEFAULT` en Supabase para columnas obligatorias (ej: `rol`, `activo`, `theme_primary`). Esto hace que la base de datos sea resiliente aunque el código falle.
3.  **Logs de Error Detallados:** Siempre capturar y mostrar el objeto `dbError` en los logs del servidor para diagnosticar fallos en segundos.

### Error 18 — RLS no funciona en Server Components (SSR)
**Síntoma:** El cliente logueado seguía viendo todos los perfiles de la base de datos.  
**Causa:** Se usaba un cliente de Supabase estático que no pasaba los tokens de sesión del usuario al servidor.  
**Solución:** Migrar a `@supabase/ssr` y usar `createClient()` en el servidor pasándole las cookies. Además, forzar el renderizado dinámico con `export const dynamic = 'force-dynamic'` para evitar datos cacheados de otros usuarios.

### Error 19 — Service Role Key expuesta en `NEXT_PUBLIC_`
**Riesgo:** Tener la clave maestra en una variable `NEXT_PUBLIC_` anula el RLS y permite a cualquier usuario editar cualquier dato desde el navegador.  
**Solución:** Usar SOLO la clave **anon/public** para variables `NEXT_PUBLIC_`. La `SERVICE_ROLE_KEY` debe estar en variables privadas (sin el prefijo `NEXT_PUBLIC_`) y usarse solo en el servidor (como webhooks).

### Decisión 24 — Fotos de Perfil en VCard (.vcf)
**Problema:** Los contactos descargados no mostraban la foto en el celular.  
**Solución:** En el endpoint `/api/vcf/[slug]`, descargar la imagen de Supabase Storage, convertirla a Base64 e incrustarla directamente en el campo `PHOTO;ENCODING=b;TYPE=JPEG:[BASE64]`.  
**Beneficio:** Experiencia premium donde el cliente guarda el contacto con foto incluida automáticamente.

### Error 20 — Conflicto de Políticas RLS y Fuga de Service Role Key
**Problema:** El aislamiento multi-tenant fallaba y los usuarios veían datos ajenos.  
**Causa Raíz:** 
1. Se estaba usando la `SERVICE_ROLE_KEY` en una variable `NEXT_PUBLIC_`, lo que anulaba el RLS en el cliente.
2. Existían políticas `SELECT` antiguas que permitían acceso público, las cuales se sumaban a las nuevas restricciones.
3. El uso de clientes estáticos en Server Components no enviaba las cookies de sesión.
**Solución:**
1. **Nuke SQL:** Borrar todas las políticas previas de la tabla con un script `DO $$` y crear una única política restrictiva basada en `auth.uid() = user_id` y `auth.jwt() ->> 'email'`.
2. **Key Security:** Mover la `SERVICE_ROLE_KEY` a variables privadas y usar solo `anon` para el frontend.
3. **SSR & Dynamic:** Usar `@supabase/ssr` y `export const dynamic = 'force-dynamic'` en las rutas de administración.

### Error 21 — RLS bloquea el Ruteo en el Middleware
**Problema:** Al activar RLS y cambiar la clave pública a `anon`, el Middleware dejó de encontrar los dominios personalizados en la base de datos.  
**Causa:** El Middleware realiza consultas como un "visitante anónimo". Bajo RLS, un visitante anónimo no tiene permisos para ver la tabla `perfiles`, por lo que la consulta devolvía vacío.  
**Solución:** Usar la `SUPABASE_SERVICE_ROLE_KEY` dentro de `middleware.ts` para las consultas de infraestructura de ruteo.

### Error 22 — Conflicto de Respuestas en Middleware (updateSession vs rewrite)
**Problema:** El sitio de Lili mostraba la Landing Page o 404 a pesar de tener el ruteo configurado.  
**Causa:** `updateSession` genera una nueva respuesta. Si se llama después de un `rewrite`, la sobreescribe.  
**Solución:** Unificar la respuesta. Obtener primero la respuesta de la sesión y pasarla como base al comando `rewrite`: `return NextResponse.rewrite(url, { request: { headers: sessionResponse.headers } })`.

### Buena Práctica de Diseño SaaS: Aislamiento Visual
**Concepto:** Los clientes finales (inquilinos) nunca deben ver herramientas de infraestructura.  
**Implementación:** Usar condicionales basados en el email o rol del usuario en el Layout para ocultar secciones de sistema (Vercel, Supabase, Logs). Esto mejora la percepción de marca y reduce la confusión del usuario.

### Decisión 25 — Arquitectura CRM y Ventas Inteligentes
**Problema:** Los datos de ventas y clientes estaban mezclados con los datos de la aplicación (perfiles).
**Solución:** Crear un esquema dedicado `crm` en la base de datos.
**Beneficio:** Aislamiento total. Puedes borrar o resetear la aplicación sin perder tu historial de ventas ni tu lista de clientes. Permite una visión 360 del cliente (saber si un mismo usuario tiene Bio y Eventos).

### Decisión 26 — Analíticas Internas vs Externas
**Lección:** Google Analytics es para marketing, pero las analíticas internas son para **valor del cliente**.
**Implementación:** Creamos un rastreador en tiempo real en Supabase que detecta el `Referer` (Instagram, Facebook, Directo).
**Ventaja:** Puedes mostrarle a tus clientes cuántas visitas tienen directamente en su panel, sin que ellos tengan que entender herramientas complejas de Google.

### Error 23 — Invalid Schema: crm
**Síntoma:** Error 500 o "Invalid schema: crm" al intentar cargar ventas.
**Causa:** Supabase bloquea por seguridad el acceso a esquemas que no sean `public` vía API.
**Solución:** Habilitar manualmente el esquema `crm` en **Settings -> API -> Exposed Schemas** dentro del dashboard de Supabase.

### Error 24 — Enlaces de WhatsApp rotos (El "1" maldito)
**Problema:** Los links `wa.me/521...` fallaban en móviles modernos o con cuentas de WhatsApp Business.
**Solución:** Eliminar el prefijo `1` (obsoleto en México) y limpiar el número de cualquier símbolo.
**Mejora Internacional:** Implementar lógica que detecta si el número ya tiene código de país (empieza con `+`) o si debe asumir el `52` de México.

---

### Decisión 27 — Contraseñas Temporales Automáticas y Onboarding Sin Fricción
**Problema:** Enviar el correo de invitación por defecto de Supabase Auth ("You have been invited") confunde a los usuarios finales debido a que proviene de un remitente desconocido, usa links genéricos y se siente desligado de la experiencia de compra de "Crea Tu Imagen".
**Solución:**
1. Crear el usuario en Supabase Auth directamente usando `supabase.auth.admin.createUser` con una contraseña temporal legible pero segura (ej: `Crea*XXXXXX`).
2. Configurar `email_confirm: true` para que la cuenta se active y confirme al instante.
3. Entregar la contraseña temporal directamente en el correo de bienvenida premium (Resend), eliminando correos adicionales de sistema.
**Beneficio:** Experiencia de onboarding ultra-limpia, 100% personalizada bajo la marca del SaaS. Permite acceso instantáneo al panel de edición y el usuario mantiene la facultad de cambiar la contraseña en su panel de perfil o solicitar restablecimiento vía email convencional.

---

### Error 25 — Privilegios de Esquema en Supabase (Llave service_role vs superusuario)
**Síntoma:** Consultas o inserciones a esquemas personalizados (ej: `crm.ventas`) arrojaban `42501 permission denied for schema crm` al usarse desde el cliente del usuario autenticado o desde el webhook del servidor con la `service_role` key.
**Causa:** 
1. PostgREST requiere habilitar explícitamente los esquemas en *Settings -> API -> Exposed Schemas*.
2. En Supabase/PostgreSQL, el rol `service_role` (que mapea la llave maestra) no es un superusuario (como `postgres`). Aunque tiene la facultad de saltarse las reglas RLS (`BYPASSRLS`), sigue obedeciendo las restricciones estándar de esquemas y tablas. Si el esquema customizado se creó bajo `postgres` y no se le concedió acceso, `service_role` es bloqueado.
**Solución:** Conceder privilegios explícitos a los roles pertinentes en el SQL Editor:
```sql
GRANT USAGE ON SCHEMA crm TO service_role, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA crm TO service_role, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA crm TO service_role, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA crm GRANT ALL ON TABLES TO service_role, authenticated;
```

### Error 26 — Desalineación de Columnas y Silencio del Webhook (Silent Failure)
**Síntoma:** El webhook de Mercado Pago retornaba con éxito `{ received: true }` a la pasarela, pero en la base de datos de producción no se registraban ventas, clientes, ni se enviaban los correos transaccionales de Resend.
**Causa:**
1. El código intentaba registrar la Inteligencia de Ventas (columnas como `canal_venta`, `vendedor`, `titulo_conceptual`) en la tabla `crm.ventas`.
2. Estas columnas no existían físicamente en la tabla de Supabase (el motor de API devolvía un error PostgREST `PGRST204`).
3. El webhook capturaba esta excepción de inserción en su bloque `catch` general para responder siempre `200 received: true` (evitando reintentos de pasarela), pero abortaba el flujo a la mitad antes de registrar la venta y disparar los correos.
**Solución:**
1. Sincronizar físicamente la tabla agregando las columnas de inteligencia comercial en Supabase:
```sql
ALTER TABLE crm.ventas 
ADD COLUMN IF NOT EXISTS vendedor text DEFAULT 'Sistema',
ADD COLUMN IF NOT EXISTS canal_venta text DEFAULT 'Web',
ADD COLUMN IF NOT EXISTS medio_demo text,
ADD COLUMN IF NOT EXISTS titulo_conceptual text,
ADD COLUMN IF NOT EXISTS ideas_principales text,
ADD COLUMN IF NOT EXISTS que_funciono text,
ADD COLUMN IF NOT EXISTS significado_personal text;
```
2. Validar siempre en entornos locales levantando un servidor controlado para ver el `stdout` y capturar el stack trace del webhook al recibir payloads de prueba.

---
© 2026 Creando Valor IA

