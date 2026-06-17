# CommerCity Frontend Web

Frontend web moderno de CommerCity construido con **HTML**, **Tailwind CSS por CDN** y **JavaScript puro**. No usa React, Vue, Angular, Vite ni frameworks frontend.

## Estado después de Fase 6.9

La Fase 6.9 cerró el ciclo de frontend web previo a decidir Fase 7 móvil.

Estado actual:

- Frontend moderno con línea visual glassmorphism.
- Integración real con backend Express/MySQL.
- Autenticación JWT en `localStorage` para MVP académico.
- Registro/login comprador, vendedor y admin.
- Validación de vendedor mayor de edad desde backend.
- Marketplace con búsqueda, filtros, ordenamiento y detalle de producto.
- Carrito local con validación contra backend antes de pagar.
- Direcciones, creación de pedido, pago sandbox y comprobante visual.
- Dashboard vendedor con tienda, productos, pedidos, envíos, ganancias, banco y reportes.
- Dashboard admin con usuarios, categorías, órdenes, productos, tiendas vía búsqueda, reportes y logs.
- Perfil comprador con pedidos y envíos.
- Tienda pública y perfil público de usuario/vendedor.
- Seguidores/seguidos, reporte de usuario y chat desde producto/perfil/tienda.
- Reseñas verificadas con mensajes claros de rechazo del backend.
- Chat con texto, adjuntos, emojis, historial, reportar/eliminar y polling controlado.
- Notificaciones globales con contador, lista, marcar leída/todas y eliminar.
- Responsive revisado en 1366, 1024, 768, 430 y 390 px.

## Levantar backend

```bash
cd /home/ubuntu/commercity/backend
npm start
```

Verificación:

```bash
curl -sS http://localhost:3000/api/v1/health
```

Respuesta esperada:

```json
{"ok":true,"message":"CommerCity API funcionando correctamente"}
```

## Levantar frontend

```bash
cd /home/ubuntu/commercity/frontend-web
python3 -m http.server 8080 --bind 0.0.0.0
```

Abrir:

```text
http://localhost:8080
```

Verificación:

```bash
curl -I http://localhost:8080/login.html
```

Debe responder `200 OK`.

## Probar desde un PC con túnel SSH

Desde el PC del evaluador/desarrollador:

```bash
ssh -L 8080:localhost:8080 -L 3000:localhost:3000 ubuntu@<IP_DEL_SERVIDOR>
```

Luego abrir:

```text
http://localhost:8080
```

Esta opción es recomendada porque el frontend detecta `localhost:8080` y consume automáticamente:

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

## Páginas principales modernas

- `index.html`: home marketplace, buscador, categorías, filtros, ordenamiento, productos y enlaces a tienda.
- `login.html`: login, registro comprador/vendedor, fecha de nacimiento de vendedor y términos.
- `producto.html`: detalle, galería, stock, carrito, reseñas verificadas, reporte de producto y chat con vendedor.
- `tienda.html?id=<id>`: perfil público de tienda, reputación, nivel, productos y chat/seguir vendedor.
- `perfil-publico.html?id=<id>`: perfil público de usuario/vendedor, seguidores, seguidos, seguir/dejar de seguir, reportar y mensaje.
- `carrito.html`: carrito multi-tienda, validación granular, dirección, pago sandbox y comprobante visual.
- `perfil.html`: perfil comprador, datos personales, pedidos y envíos/tracking.
- `vendedor.html`: tienda, productos, pedidos, envíos, ganancias, banco simulado y reportes.
- `chat.html`: conversaciones, mensajes, emojis, adjuntos, polling, reportar y eliminar.
- `admin.html`: dashboard, usuarios, categorías, órdenes, productos, tiendas vía búsqueda, reportes, moderación disponible y logs.

## Módulos implementados

### Marketplace y producto

- Catálogo público.
- Búsqueda y filtros.
- Orden por precio/calificación cuando backend lo soporta.
- Detalle con stock y cantidad máxima.
- Reporte de producto.
- Reseñas aprobadas y formulario de reseña verificada.

### Compra

- Carrito persistido en `localStorage`.
- Validación de stock/precio/estado contra backend.
- Direcciones.
- Pedido.
- Pago sandbox aprobado/rechazado.
- Comprobante visual.

### Vendedor

- Crear/editar tienda.
- Pausar/reactivar tienda.
- Crear/editar/eliminar producto.
- Ocultar/mostrar producto.
- Pedidos de tienda.
- Envíos, transportadora y guía.
- Ganancias 90% vendedor / 10% plataforma.
- Cuenta bancaria simulada.
- Productos vendidos y agotados.

### Admin

- Dashboard principal.
- Usuarios y cambio de estado.
- CRUD categorías.
- Órdenes.
- Productos globales visibles.
- Tiendas vía búsqueda admin.
- Reportes de productos.
- Reportes de usuarios.
- Logs/auditoría.
- Secciones de pendientes backend para reportes de mensajes y listado de reseñas.

### Comunidad, chat y notificaciones

- Tienda pública.
- Perfil público.
- Seguidores y seguidos.
- Seguir/dejar de seguir.
- Reportar usuario.
- Chat desde producto/perfil/tienda.
- Emoji selector simple.
- Adjuntos.
- Reportar/eliminar mensajes.
- Notificaciones con contador, lista, marcar leída/todas y eliminar.

## Pendientes backend conocidos

No inventar estos endpoints desde frontend. Si se requieren, deben implementarse/aprobarse en backend:

```text
GET /api/v1/admin/reviews
GET /api/v1/admin/reports/messages
PATCH /api/v1/admin/reports/messages/:id
GET /api/v1/admin/stores
GET /api/v1/admin/products
WebSocket/SSE para chat y notificaciones en tiempo real real
```

Notas:

- Existe `PATCH /api/v1/admin/reviews/:id/moderate`, pero falta un endpoint para listar reseñas pendientes/moderables.
- El chat y las notificaciones usan polling controlado porque no hay WebSocket/SSE.
- La gestión global admin de tiendas/productos usa endpoints existentes y búsqueda, pero faltan listados dedicados completos.

## Cómo probar roles

### Comprador

1. Crear comprador desde `login.html` → registro.
2. Entrar a `index.html`.
3. Abrir producto.
4. Agregar al carrito.
5. Validar carrito.
6. Crear/seleccionar dirección.
7. Pagar con tarjeta sandbox.
8. Ver pedidos/envíos en `perfil.html`.
9. Usar chat, perfil público, tienda pública y notificaciones.

### Vendedor

1. Crear vendedor mayor de edad desde registro.
2. Entrar a `vendedor.html`.
3. Crear tienda.
4. Crear producto.
5. Gestionar pedidos/envíos/ganancias/banco/reportes.

### Administrador

Las credenciales dependen de `backend/.env` y no se documentan aquí. Usar las credenciales controladas del entorno académico.

Probar:

- `admin.html`.
- Usuarios.
- Categorías.
- Órdenes.
- Productos.
- Tiendas vía búsqueda.
- Reportes.
- Logs.

## Tarjetas sandbox

Usar solo tarjetas de prueba:

```text
4111111111111111  aprueba
4000000000000002  rechaza
```

No usar tarjetas reales.

## Responsive validado en Fase 6.9

Tamaños revisados:

```text
1366px escritorio
1024px tablet
768px tablet pequeña
430px móvil
390px móvil
```

Ajustes aplicados:

- Sidebar vendedor/admin contenida en móvil.
- Contenedor dashboard sin overflow horizontal crítico.
- Cards y tablas con scroll/control responsive en pantallas pequeñas.

## Verificaciones rápidas

```bash
cd /home/ubuntu/commercity
curl -sS http://localhost:3000/api/v1/health
curl -I http://localhost:8080/login.html
find frontend-web/assets/js -name '*.js' -print0 | xargs -0 -n1 node --check
```

## Archivos legacy

Todavía existen páginas y módulos heredados en:

```text
frontend-web/pages
frontend-web/js
frontend-web/components
```

Se mantienen por compatibilidad con fases anteriores. No se borraron durante Fase 6.9. La experiencia principal moderna usa las páginas raíz y `frontend-web/assets/js`.

## Notas de Fase 6.9

- Auditoría final contra DOCX generada fuera del repositorio en `/tmp/commercity_fase69_audit/` para no modificar `docs/`.
- Cumplimiento ponderado aproximado calculado: 84.1% global, 82.6% RF y 90.0% RNF.
- El frontend web queda funcionalmente listo para evaluación y para considerar Fase 7 móvil, con pendientes backend claramente identificados.
- `mobile-app` no hace parte de esta fase y no debe modificarse desde frontend web.
