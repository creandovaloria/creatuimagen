# 📐 Tabla de referencia de assets — creatuimagen.online

## Invitaciones digitales — Especificaciones de imágenes

| # | Sección | Nombre archivo | Resolución | Orientación | Formato | Calidad | Cloudinary path |
|---|---------|---------------|-----------|-------------|---------|---------|----------------|
| 1 | Intro / portada | `intro.jpg` | 1080 x 1920px | Vertical 9:16 | JPG | 85% | creatuimagen/XV-Regina/intro |
| 2 | Reproductor música | `musica.jpg` | 1080 x 800px | Horizontal | JPG | 85% | creatuimagen/XV-Regina/musica |
| 3 | Collage Polaroid | `collage.jpg` | 1080 x 1080px | Cuadrada | JPG | 85% | creatuimagen/XV-Regina/collage |
| 4 | Lugar del evento | `restaurante.jpg` | 1080 x 800px | Horizontal | JPG | 85% | creatuimagen/XV-Regina/restaurante |
| 5 | Tira fotográfica | `tira.jpg` | 1080 x 800px | Horizontal | JPG | 85% | creatuimagen/XV-Regina/tira |
| 6 | Flamingo / RSVP | `flamingo.jpg` | 800 x 800px | Cuadrada | JPG | 85% | creatuimagen/XV-Regina/flamingo |

---

## Notas generales

- **Cloudinary optimiza automáticamente** según dispositivo — no te preocupes por múltiples versiones
- **Peso máximo sugerido antes de subir:** 2MB por imagen
- **Formato alternativo:** PNG solo si la imagen tiene transparencia (ej. flamingo con fondo transparente)
- Cloudinary convierte a **AVIF/WebP** automáticamente para navegadores modernos

---

## Perfiles digitales — Especificaciones (futuro)

| Sección | Nombre archivo | Resolución | Orientación | Cloudinary path |
|---------|---------------|-----------|-------------|----------------|
| Foto de perfil | `avatar.jpg` | 400 x 400px | Cuadrada | creatuimagen/perfiles/[slug]/avatar |
| Banner / fondo | `banner.jpg` | 1080 x 400px | Horizontal | creatuimagen/perfiles/[slug]/banner |

---

## URLs de Cloudinary — XV Regina (actuales en producción)

Base: `https://res.cloudinary.com/dl66zeuix/image/upload/f_auto,q_auto/`

| Imagen | Versión / archivo |
|--------|------------------|
| intro | `v1779170475/Gemini_Generated_Image_c44urfc44urfc44u_pnv1tf.jpg` |
| musica | `v1778144448/1.1_2_Reproductor_buyhad.png` |
| collage | `v1779163175/Gemini_Generated_Image_wych0zwych0zwych_hsfnuc.jpg` |
| tira | `v1779164899/Tira_-_fotos_kq7bvv.png` |
| flamingo | `v1778145782/1.1_7_Flamingo_gpdtsc.png` |
| restaurante | `v1779169244/WhatsApp_Image_2026-05-18_at_23.24.35_fnundq.jpg` |

> Las URLs reales están definidas en `lib/regina-images.ts`

---

## Transformaciones útiles de Cloudinary

| Transformación | URL ejemplo |
|---------------|------------|
| Resize a 390px (móvil) | `.../w_390,f_auto,q_auto/...` |
| Resize a 1080px (desktop) | `.../w_1080,f_auto,q_auto/...` |
| Recortar centrado | `.../w_1080,h_1920,c_fill/...` |
| Calidad automática | `.../f_auto,q_auto/...` |
