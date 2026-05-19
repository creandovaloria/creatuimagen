# TROUBLESHOOTING — creatuimagen-platform

Guía rápida para diagnosticar y resolver los problemas más comunes.

---

## 🔴 Deploy en Vercel

### Deployment atascado en "Queued" o "Initializing"
- Vercel procesa deployments en cola — esperar 1-2 min es normal.
- Si lleva más de 5 min: ir a Vercel → Deployments → cancelar el deployment y hacer un nuevo push.

### Build falla con "Module not found"
- **Causa:** Archivo creado localmente pero no incluido en el push.
- **Solución:** `git status` para verificar que todos los archivos están staged. Hacer push completo.

### Build falla con "supabaseKey is required"
- **Causa:** Una ruta de API intenta conectar a Supabase en build time.
- **Solución:** Agregar `export const dynamic = 'force-dynamic'` al inicio del archivo de la ruta.

### Error 404 en rutas dinámicas (`/[slug]`) para registros nuevos
- **Causa:** Next.js pre-renderiza estáticamente las rutas dinámicas en build time.
- **Solución:** Agregar `export const dynamic = 'force-dynamic'` en el `page.tsx` de la ruta.

---

## 🔴 Imágenes

### Imagen no aparece en producción
1. Verificar que la URL de Cloudinary es pública (abrir en navegador).
2. Verificar que el campo en `lib/regina-images.ts` apunta a la versión/archivo correcto.
3. Cloudinary puede tardar 1-2 min en procesar imágenes recién subidas.

### Imagen se ve en Cloudinary pero no en la invitación
- Revisar que el nombre del archivo no tenga caracteres especiales sin encodear (tildes, espacios).
- Los espacios deben ser `%20`, las tildes deben encodear correctamente o evitarse.

---

## 🔴 Música (SoundCloud)

### El botón de play no reproduce nada
- **Causa frecuente:** El SDK de SoundCloud aún no cargó.
- El botón muestra "♪ cargando..." hasta que el widget está listo — esto es normal.
- Si lleva más de 10 segundos: revisar la consola del navegador por errores de red.

### En iOS no reproduce al primer click
- **Causa:** Safari requiere user gesture directo para audio.
- **Solución ya implementada:** `pendingPlay` ref — se reproduce automáticamente cuando el SDK dispara el evento `READY`.

### YouTube Error 150
- Icona Pop tiene embedding deshabilitado en YouTube.
- **Solución permanente:** Usar SoundCloud Widget API (ya implementado).

---

## 🔴 Supabase

### RLS bloquea inserciones ("new row violates row-level security policy")
- Verificar que el bucket o tabla tiene políticas RLS para la operación (INSERT, UPDATE, SELECT).
- Para `storage.objects` (bucket `avatars`): crear las 3 políticas desde el SQL Editor de Supabase.

### Consultas devuelven vacío desde el Middleware
- El Middleware corre como visitante anónimo — bajo RLS no puede ver tablas restringidas.
- **Solución:** Usar `SUPABASE_SERVICE_ROLE_KEY` (variable privada) en `middleware.ts` para consultas de infraestructura.

### Error "Invalid schema: crm"
- Ir a Supabase → Settings → API → Exposed Schemas y agregar `crm`.

---

## 🔴 Invitación XV-Regina

### El countdown muestra "00:00:00"
- Verificar que la fecha en `<CalendarioCountdown eventDate="...">` es futura y está en formato ISO correcto.
- Fecha del evento: `2026-06-06T14:00:00`

### El botón de WhatsApp no abre correctamente
- Verificar que el número no tiene `+`, espacios ni guiones — solo dígitos con código de país: `524272199374`.
- Probar en móvil real, no en desktop (WhatsApp web puede comportarse diferente).

### Imagen del lugar muestra "Por definir"
- Verificar que el prop `porDefinir` no está siendo pasado al componente `<Venue>`.
- El prop `nombre`, `direccion`, `fecha`, `hora` y `mapsUrl` deben estar todos presentes.

---

## 🔴 DNS / Dominios

### Subdominio muestra error 404 genérico de Vercel
- El subdominio apunta al DNS de Vercel pero no está registrado en el proyecto.
- Ir a Vercel → proyecto `creatuimagen-platform` → Settings → Domains → agregar el subdominio.

### Cambios de DNS tardan en propagarse
- Propagación normal: 5-30 minutos para subdominios CNAME.
- Verificar con: `dig CNAME invitaciones.creatuimagen.online`

---

## 🔐 Seguridad

### Nunca exponer en el repositorio
- `SUPABASE_SERVICE_ROLE_KEY` — solo en variables privadas de Vercel (sin `NEXT_PUBLIC_`)
- Tokens de GitHub — revocar después de cada sesión de trabajo con Claude
- Credenciales de Mercado Pago

### Variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Esta sí puede ser pública — es la clave anónima diseñada para el frontend.
- La `SERVICE_ROLE_KEY` NUNCA debe tener prefijo `NEXT_PUBLIC_`.

---

© 2026 Creando Valor IA
