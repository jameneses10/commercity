# CommerCity Frontend Web

Frontend web moderno de CommerCity construido con **HTML**, **Tailwind CSS por CDN** y **JavaScript puro**. No usa React, Vue, Angular, Vite ni frameworks frontend.

## Estado actual

- Frontend moderno glassmorphism en páginas raíz.
- Consumo real del backend Express/MySQL.
- JWT en `localStorage` para sesión MVP.
- Uploads con `FormData` para tienda, productos, perfil y chat.
- Carrito local en `localStorage` con validación contra backend antes de pagar.
- Diseño responsive para escritorio, tablet y móvil.

## Levantar backend

```bash
cd /home/ubuntu/commercity/backend
npm start
```

Verificación:

```bash
curl -sS http://localhost:3000/api/v1/health
```

## Levantar frontend

```bash
cd /home/ubuntu/commercity/frontend-web
python3 -m http.server 8080 --bind 0.0.0.0
```

Abrir localmente:

```text
http://localhost:8080
```

## Probar desde un PC con túnel SSH

Desde el PC del evaluador/desarrollador:

```bash
ssh -L 8080:localhost:8080 -L 3000:localhost:3000 ubuntu@149.130.178.228
```

Luego abrir:

```text
http://localhost:8080
```

Esta es la opción recomendada porque el frontend detecta `localhost:8080` y consume automáticamente:

```text
http://localhost:3000/api/v1
```

## Configuración de API

Archivo principal:

```text
frontend-web/assets/js/config.js
```

Valor efectivo en desarrollo local/túnel:

```text
http://localhost:3000/api/v1
```

Modos soportados:

- `auto`: modo por defecto. Usa `localhost:3000` cuando el frontend está en `localhost:8080`, y `MISMO_HOST:3000` cuando se sirve por IP/dominio en puerto 8080.
- `same-origin`: recomendado para producción con Nginx si `/api/v1` queda bajo el mismo dominio del frontend.
- `custom`: usar cuando la API esté en un dominio externo.

Ejemplo para Nginx con proxy `/api/v1`:

```js
const API_MODE = 'same-origin';
```

Ejemplo para API externa:

```js
const API_MODE = 'custom';
const CUSTOM_API_ORIGIN = 'https://api.commercity.com';
```

También puede sobreescribirse antes de cargar módulos:

```js
window.COMMERCITY_API_ORIGIN = 'https://api.commercity.com';
```

El cliente legacy `frontend-web/js/api/client.js` reutiliza esta misma configuración para evitar URLs rígidas.

## Páginas principales modernas

- `index.html`: home marketplace, buscador, categorías, productos, cards modernas y carrito.
- `login.html`: login, registro comprador/vendedor, fecha de nacimiento obligatoria para vendedor y términos.
- `producto.html`: detalle, galería múltiple, miniaturas, reseñas, carrito y chat con vendedor.
- `carrito.html`: carrito multi-tienda, dirección, validación y pago sandbox.
- `vendedor.html`: dashboard vendedor, tienda con logo/banner, productos con varias imágenes y eliminación de imágenes.
- `perfil.html`: datos del usuario, foto de perfil y descripción personal.
- `chat.html`: conversaciones, burbujas, emojis, adjuntos, reportar y eliminar mensajes.
- `admin.html`: estadísticas, búsqueda global, usuarios, reportes y acciones administrativas.

## Módulos modernos

- `assets/css/styles.css`: tokens visuales, glassmorphism, responsive, cards, sidebars, chat, tablas y estados.
- `assets/js/config.js`: configuración de API y protección básica de render HTML.
- `assets/js/api.js`: cliente HTTP para GET, POST, PATCH, DELETE y FormData con JWT automático.
- `assets/js/auth.js`: sesión, token, usuario actual, protección por rol y redirección.
- `assets/js/ui.js`: header, sidebar, toasts, loading en botones, skeletons, estados vacíos y previews.
- `assets/js/cart-store.js`: carrito persistido en `localStorage`.
- Scripts por página: `home.js`, `login.js`, `producto.js`, `carrito.js`, `vendedor.js`, `perfil.js`, `chat.js`, `admin.js`.

## Manejo de errores

El cliente `assets/js/api.js` muestra mensajes claros para:

- `400`: validación de formularios.
- `401`: sesión expirada; limpia sesión y redirige a login.
- `403`: acceso no permitido.
- `404`: recurso no encontrado.
- `500`: error amigable del servidor.
- Error de conexión: “No se pudo conectar con el servidor”.

Los formularios principales usan estado de carga en botones y toasts de éxito/error.

## Diseño aplicado

Basado en:

```text
docs/diseno/stitch_commercity_modern_marketplace/commercity_glass_system/DESIGN.md
```

Elementos visuales:

- Glassmorphism con blur y transparencia.
- Fondos claros de marketplace moderno.
- Botones pill/circulares.
- Cards modernas con sombras suaves.
- Inputs redondeados.
- Naranja para acciones de compra.
- Azul para navegación, enlaces y estados secundarios.
- Inter para títulos.
- Poppins para textos, labels y navegación.
- Sidebar fija en escritorio para vendedor/admin.
- Sidebar colapsable en móvil.

## Responsive

CSS revisado para:

- Escritorio: 1366px.
- Tablet: 1024px.
- Tablet pequeña: 768px.
- Móvil: 430px.
- Móvil pequeño: 390px.

Breakpoints principales:

```text
1024px
900px
560px
```

## Tarjetas sandbox

Usar solo tarjetas de prueba:

```text
4111111111111111  aprueba
4000000000000002  rechaza
```

No se deben usar tarjetas reales.

## Credenciales simuladas

El seed de administrador depende de variables del backend. Si no fueron cambiadas en `.env`, el proyecto usa credenciales de desarrollo. No se documentan aquí contraseñas reales ni secretos. Para pruebas, usar usuarios creados desde el propio formulario o datos seed controlados por el docente/desarrollador.

## Archivos legacy

Todavía existen páginas y módulos heredados en:

```text
frontend-web/pages
frontend-web/js
frontend-web/components
```

Se mantienen por compatibilidad con fases anteriores. No se borraron porque algunas rutas auxiliares todavía pueden usarse para notificaciones, perfiles públicos, followers/following y pantallas históricas. La experiencia principal moderna usa las páginas raíz y `frontend-web/assets/js`.

## Verificaciones rápidas

```bash
cd /home/ubuntu/commercity
curl -sS http://localhost:3000/api/v1/health
curl -I http://localhost:8080
find frontend-web/assets/js frontend-web/js -name '*.js' -print0 | xargs -0 -n1 node --check
```

## Limitaciones actuales

- Chat interno sin WebSockets ni tiempo real.
- Tailwind se carga por CDN para mantener la tecnología simple de la fase.
- Prueba visual automatizada en servidor depende de tener Chrome instalado; si no está, usar túnel SSH y navegador local.
- `mobile-app` no hace parte de esta fase.
