# CommerCity Frontend Web - Fase 6

Interfaz web responsive del marketplace CommerCity construida con HTML, Tailwind CSS por CDN y JavaScript puro.

## API consumida

La URL base está centralizada en:

```text
js/api/client.js
```

Valor actual:

```text
http://localhost:3000/api/v1
```

## Ejecución local

1. Iniciar backend:

```bash
cd /home/ubuntu/commercity/backend
npm start
```

2. Servir frontend estático:

```bash
cd /home/ubuntu/commercity/frontend-web
python3 -m http.server 8080
```

3. Abrir:

```text
http://localhost:8080
```

También puede usarse Live Server desde VS Code.

## Páginas implementadas

- `index.html`: Home con categorías y productos destacados.
- `pages/login.html`: Login con JWT y redirección por rol.
- `pages/register.html`: Registro comprador/vendedor.
- `pages/products.html`: Catálogo con búsqueda, filtros y paginación básica.
- `pages/product-detail.html`: Detalle de producto y reseñas.
- `pages/cart.html`: Carrito persistido en localStorage y validación backend.
- `pages/checkout.html`: Dirección, creación de pedido y pago sandbox.
- `pages/buyer-dashboard.html`: Pedidos, envíos, notificaciones y reseñas.
- `pages/seller-dashboard.html`: Tienda, productos, pedidos, envíos y notificaciones.
- `pages/admin-dashboard.html`: Categorías, pedidos y logs.

## Seguridad frontend

- No se guardan contraseñas.
- No se guardan datos de tarjeta.
- No se guarda CVV.
- No hay tokens reales ni secrets en el código.
- El JWT se guarda en localStorage solo para sesión web del MVP.
- `guards.js` protege páginas por rol.
- Si la API responde 401, se limpia la sesión y se redirige al login.

## Tarjetas sandbox

Usar solo tarjetas de prueba:

```text
4111111111111111 aprueba
4000000000000002 rechaza
```

## Producción

Para producción se recomienda compilar Tailwind en lugar de usar CDN y configurar una URL de API externa en `js/api/client.js`.

## Fase 6.1C - Social, chat y administración

Páginas agregadas:

- `pages/chat.html`: lista conversaciones del usuario autenticado.
- `pages/conversation.html`: muestra y envía mensajes de una conversación.
- `pages/followers.html`: lista seguidores de un perfil.
- `pages/following.html`: lista usuarios seguidos por un perfil.
- `pages/admin-reports-users.html`: gestión de reportes de usuarios.
- `pages/admin-search.html`: buscador global admin de usuarios, productos y tiendas.
- `pages/admin-users.html`: gestión de estado de usuarios.
- `pages/notifications.html`: notificaciones, contador, marcar leídas y eliminación lógica.

APIs frontend agregadas:

- `js/api/chat.api.js`
- `js/api/follow.api.js`
- `js/api/userReports.api.js`
- `js/api/adminStats.api.js`
- `js/api/adminSearch.api.js`

Páginas existentes actualizadas:

- `components/header.js`: acceso a chat y contador de notificaciones no leídas.
- `pages/public-profile.html` / `js/pages/public-profile.js`: seguir/dejar de seguir, contadores, reportar usuario y enviar mensaje a vendedor.
- `pages/buyer-dashboard.html` / `js/pages/buyer-dashboard.js`: accesos a chat y notificaciones.
- `pages/seller-dashboard.html` / `js/pages/seller-dashboard.js`: accesos a chat, estadísticas, ganancias y cuenta bancaria simulada.
- `pages/admin-dashboard.html` / `js/pages/admin-dashboard.js`: estadísticas admin, reportes de usuarios, reportes de productos, búsqueda y gestión.

Limitaciones:

- Chat interno básico sin WebSockets.
- No hay tiempo real; se consulta bajo demanda.
- No hay app móvil en esta fase.
- Notificaciones internas persistidas en base de datos.

## Frontend moderno glassmorphism

Reconstrucción principal en HTML + Tailwind CDN + JavaScript puro, sin React/Vue/Angular/Vite.

Páginas raíz implementadas:

- `index.html`: marketplace, buscador, filtros por categoría, cards modernas y carrito local.
- `login.html`: login, registro comprador/vendedor, edad obligatoria para vendedor, términos y redirección por rol.
- `producto.html`: detalle, galería múltiple desde `imagenes`, reseñas, carrito y creación de conversación.
- `carrito.html`: carrito multi-tienda, dirección, validación y pago sandbox.
- `vendedor.html`: dashboard vendedor, tienda con logo/banner por archivo, productos con imágenes múltiples y eliminación de imagen.
- `perfil.html`: datos autenticados, foto de perfil y descripción personal con FormData.
- `chat.html`: conversaciones, burbujas, emojis, adjuntos, reportar/eliminar mensajes.
- `admin.html`: estadísticas, búsqueda global, usuarios, estados y reportes.

Módulos nuevos:

- `assets/css/styles.css`: tokens visuales, glassmorphism, responsive, sidebars y componentes.
- `assets/js/config.js`: `API_BASE_URL` configurable.
- `assets/js/api.js`: cliente HTTP reutilizable con JWT, JSON, FormData y errores claros.
- `assets/js/auth.js`: sesión, token, usuario actual, protección por rol.
- `assets/js/ui.js`: layout, header, sidebar, notificaciones, toasts, previews.
- `assets/js/cart-store.js`: carrito en localStorage.
- Scripts por página: `home.js`, `login.js`, `producto.js`, `carrito.js`, `vendedor.js`, `perfil.js`, `chat.js`, `admin.js`.

Diseño aplicado desde `docs/diseno/stitch_commercity_modern_marketplace/commercity_glass_system/DESIGN.md`:

- Glassmorphism, blur, tarjetas translúcidas y fondos claros.
- Naranja para acciones de compra y azul para navegación/estados secundarios.
- Inter para títulos y Poppins para texto/navegación.
- Botones pill/circulares, inputs redondeados, buscador tipo pill.
- Sidebar fija en panel vendedor/admin para escritorio y colapsable en móvil.
- Media queries para escritorio, tablet y móvil.
