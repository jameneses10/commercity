# CommerCity Backend

Backend base de CommerCity construido con Node.js + Express + MySQL.

## Estado actual

Fase 2: backend, base de datos, autenticación y roles.

Incluye:

- Health check.
- Migración de tablas `roles` y `usuarios`.
- Seed de roles.
- Seed de administrador general.
- Registro público solo para `comprador` y `vendedor`.
- Login con JWT.
- Hash de contraseñas con bcrypt.
- Middleware `authRequired`.
- Middleware `requireRole`.
- Ruta temporal `GET /api/v1/auth/admin-test` para verificar RBAC.

No incluye todavía tiendas, productos, categorías, carrito, pedidos, pagos, envíos, reseñas, frontend funcional ni app móvil.

## Requisitos

- Node.js LTS.
- npm.
- MySQL activo y accesible.

## Configurar variables de entorno

```bash
cd /home/ubuntu/commercity/backend
cp .env.example .env
```

Editar `.env` con los datos reales del entorno local o servidor.

Variables principales:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=commercity_db
DB_USER=commercity_user
DB_PASSWORD=change_me
JWT_SECRET=change_me_in_real_env
JWT_EXPIRES_IN=1d
ADMIN_NAME=Administrador CommerCity
ADMIN_EMAIL=admin@commercity.local
ADMIN_PASSWORD=Admin12345!
```

Importante:

- No subir `.env` al repositorio.
- Cambiar `JWT_SECRET` en entornos reales.
- Cambiar `ADMIN_PASSWORD` en entornos reales.
- No usar credenciales de prueba en producción.

## Instalar dependencias

```bash
npm install
```

## Scripts disponibles

```bash
npm run dev        # Ejecuta backend con nodemon
npm start          # Ejecuta backend con node
npm run db:migrate # Ejecuta archivos SQL de database/migrations
npm run db:seed    # Ejecuta seeds de roles y administrador general
```

## Ejecutar migraciones

```bash
npm run db:migrate
```

Qué hace:

- Crea tabla `roles` si no existe.
- Crea tabla `usuarios` si no existe.
- Crea índices y relación `usuarios.rol_id -> roles.id`.

## Ejecutar seeds

```bash
npm run db:seed
```

Qué hace:

- Inserta o actualiza roles base: `comprador`, `vendedor`, `administrador`.
- Crea o actualiza el administrador general definido por `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
- El administrador solo se crea por seed; no existe registro público para administradores.

## Correr backend

```bash
npm run dev
```

O:

```bash
npm start
```

Base URL local:

```text
http://localhost:3000
```

## Health check

```bash
curl http://localhost:3000/api/v1/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "message": "CommerCity API funcionando correctamente",
  "data": {
    "service": "backend",
    "version": "1.0.0"
  }
}
```

## Probar registro comprador

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Comprador Demo",
    "correo":"comprador.demo@commercity.local",
    "password":"Comprador123!",
    "confirmPassword":"Comprador123!",
    "rol":"comprador",
    "telefono":"3000000000"
  }'
```

## Probar registro vendedor

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Vendedor Demo",
    "correo":"vendedor.demo@commercity.local",
    "password":"Vendedor123!",
    "confirmPassword":"Vendedor123!",
    "rol":"vendedor",
    "telefono":"3110000000"
  }'
```

## Probar rechazo de registro administrador

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Admin No Permitido",
    "correo":"admin.publico@commercity.local",
    "password":"Admin12345!",
    "confirmPassword":"Admin12345!",
    "rol":"administrador"
  }'
```

Debe devolver error `400` por validación de rol público no permitido.

## Probar login

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo":"comprador.demo@commercity.local",
    "password":"Comprador123!"
  }'
```

La respuesta incluye `data.token` y `data.user` sin `password_hash`.

## Probar /auth/me sin token

```bash
curl -i http://localhost:3000/api/v1/auth/me
```

Debe devolver `401 Unauthorized`.

## Probar /auth/me con token

```bash
TOKEN="PEGAR_TOKEN_AQUI"

curl -sS http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer ${TOKEN}"
```

Debe devolver el usuario autenticado sin `password_hash`.

## Probar 403 con comprador en ruta admin

```bash
TOKEN_COMPRADOR="PEGAR_TOKEN_COMPRADOR_AQUI"

curl -i http://localhost:3000/api/v1/auth/admin-test \
  -H "Authorization: Bearer ${TOKEN_COMPRADOR}"
```

Debe devolver `403 Forbidden`.

## Probar ruta admin con administrador

Primero iniciar sesión con el administrador creado por seed:

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo":"admin@commercity.local",
    "password":"Admin12345!"
  }'
```

Luego usar el token:

```bash
TOKEN_ADMIN="PEGAR_TOKEN_ADMIN_AQUI"

curl -sS http://localhost:3000/api/v1/auth/admin-test \
  -H "Authorization: Bearer ${TOKEN_ADMIN}"
```

Debe devolver `200 OK`.

## Seguridad aplicada

- `password_hash` no se devuelve en respuestas.
- Registro público de administrador bloqueado.
- Login usa mensaje genérico para credenciales inválidas.
- JWT se firma con variable `JWT_SECRET` desde `.env`.
- Rutas privadas validan el encabezado Authorization con esquema Bearer.
- Rutas por rol usan `requireRole`.


---

# Fase 3 - Tiendas, Categorías, Productos e Inventario

## Migración nueva

```bash
npm run db:migrate
```

Ejecuta también:

```text
database/migrations/002_create_tiendas_categorias_productos.sql
```

Crea las tablas:

- `tiendas`
- `categorias`
- `productos`

No ejecuta `DROP DATABASE` ni `DROP TABLE`.

## Seed nuevo

```bash
npm run db:seed
```

Ejecuta también:

```text
database/seeders/002_seed_categorias.sql
```

Crea o actualiza categorías iniciales:

- Tecnología
- Hogar
- Moda
- Ferretería
- Belleza
- Deportes
- Accesorios

## Endpoints de tiendas

```text
POST   /api/v1/stores
GET    /api/v1/stores/:id
GET    /api/v1/stores/me
PATCH  /api/v1/stores/me
PATCH  /api/v1/stores/:id/pause
PATCH  /api/v1/stores/:id/activate
GET    /api/v1/stores/:id/products
```

Ejemplo crear tienda como vendedor:

```bash
curl -X POST http://localhost:3000/api/v1/stores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_VENDEDOR_AQUI" \
  -d '{
    "nombre":"Tienda Demo",
    "descripcion":"Tienda de prueba para CommerCity",
    "logo_url":"https://example.com/logo.png",
    "banner_url":"https://example.com/banner.png"
  }'
```

## Endpoints de categorías

```text
GET    /api/v1/categories
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

Ejemplo crear categoría como administrador:

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI" \
  -d '{
    "nombre":"Papelería",
    "descripcion":"Productos de oficina, colegio y papelería"
  }'
```

## Endpoints de productos

```text
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
PATCH  /api/v1/products/:id/visibility
DELETE /api/v1/products/:id
```

Ejemplo crear producto como vendedor:

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_VENDEDOR_AQUI" \
  -d '{
    "nombre":"Taladro Percutor 750W",
    "descripcion":"Taladro percutor de prueba para catálogo CommerCity",
    "precio":280000,
    "stock":10,
    "categoria_id":1,
    "imagen_url":"https://example.com/taladro.png"
  }'
```

Ejemplo catálogo público:

```bash
curl "http://localhost:3000/api/v1/products?q=taladro&sort=price_asc&page=1&limit=12"
```

Filtros soportados:

- `q`
- `category_id`
- `store_id`
- `min_price`
- `max_price`
- `sort`: `newest`, `price_asc`, `price_desc`, `rating_desc`
- `page`
- `limit`

## Reglas de seguridad Fase 3

- Solo vendedor autenticado puede crear tienda.
- Comprador no puede crear tienda ni categoría.
- Solo administrador puede crear, editar o inactivar categorías.
- Vendedor solo puede editar productos de su propia tienda.
- Administrador puede cambiar visibilidad o eliminar lógicamente productos.
- Productos ocultos, eliminados o de tiendas pausadas no aparecen en catálogo público.
- La eliminación de productos es lógica: cambia estado a `eliminado`.
- Categorías con productos activos no se inactivan; devuelven `409 Conflict`.


---

# Fase 4 - Carrito, Direcciones, Pedidos y Pagos Sandbox

## Migración nueva

```bash
npm run db:migrate
```

Ejecuta también:

```text
database/migrations/003_create_direcciones_pedidos_pagos_comisiones.sql
```

Crea las tablas:

- `direcciones`
- `pedidos`
- `pedido_detalles`
- `pagos`
- `comisiones`

No contiene `DROP DATABASE` ni `DROP TABLE`.

## Endpoints de carrito

```text
POST /api/v1/cart/validate
```

Solo comprador autenticado. El backend valida producto, tienda, stock, precio y total. El carrito local nunca es fuente de verdad.

## Endpoints de direcciones

```text
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
```

Solo comprador autenticado. Una dirección asociada a pedidos históricos no se elimina físicamente.

## Endpoints de pedidos

```text
POST /api/v1/orders
GET  /api/v1/orders/my-orders
GET  /api/v1/orders/:id
GET  /api/v1/seller/orders
GET  /api/v1/admin/orders
```

La creación de pedido usa transacción MySQL, conserva precio histórico y no descuenta stock todavía.

## Endpoints de pagos sandbox

```text
POST /api/v1/payments/sandbox
POST /api/v1/payments/webhook-simulated
```

El webhook simulado está protegido con JWT de administrador.

## Tarjetas de prueba

- `4111111111111111`: aprueba.
- `4000000000000002`: rechaza.
- Cualquier otra: rechazada o inválida.

No se guarda número completo de tarjeta ni CVV. Solo se registra método, referencia, estado y mensaje.

## Ejemplo validar carrito

```bash
curl -X POST http://localhost:3000/api/v1/cart/validate   -H "Content-Type: application/json"   -H "Authorization: Bearer TOKEN_COMPRADOR"   -d '{"items":[{"producto_id":1,"cantidad":1}]}'
```

## Ejemplo crear dirección

```bash
curl -X POST http://localhost:3000/api/v1/addresses   -H "Content-Type: application/json"   -H "Authorization: Bearer TOKEN_COMPRADOR"   -d '{"departamento":"Santander","ciudad":"Bucaramanga","direccion":"Calle 1 # 2-3","codigo_postal":"680001","telefono":"3000000000"}'
```

## Ejemplo crear pedido

```bash
curl -X POST http://localhost:3000/api/v1/orders   -H "Content-Type: application/json"   -H "Authorization: Bearer TOKEN_COMPRADOR"   -d '{"direccion_id":1,"items":[{"producto_id":1,"cantidad":1}]}'
```

## Ejemplo pago aprobado

```bash
curl -X POST http://localhost:3000/api/v1/payments/sandbox   -H "Content-Type: application/json"   -H "Authorization: Bearer TOKEN_COMPRADOR"   -d '{"pedido_id":1,"card_number":"4111111111111111","card_holder":"Comprador Demo","exp_month":12,"exp_year":2030,"cvv":"123"}'
```

## Ejemplo pago rechazado

```bash
curl -X POST http://localhost:3000/api/v1/payments/sandbox   -H "Content-Type: application/json"   -H "Authorization: Bearer TOKEN_COMPRADOR"   -d '{"pedido_id":2,"card_number":"4000000000000002","card_holder":"Comprador Demo","exp_month":12,"exp_year":2030,"cvv":"123"}'
```

## Reglas Fase 4

- Pago aprobado cambia pedido a `pagado` y `procesando`.
- Pago aprobado descuenta stock.
- Si stock queda en cero, el producto pasa a `agotado`.
- Pago aprobado genera comisiones por tienda con 10%.
- Pago rechazado no descuenta stock.
- Pago rechazado no genera comisiones.
- No se puede pagar dos veces un pedido ya aprobado.
- Comprador solo ve sus pedidos y direcciones.
- Vendedor solo ve pedidos donde participa su tienda.
- Administrador puede ver todos los pedidos.


---

# Fase 5 - Envíos, Reseñas, Reputación, Notificaciones y Logs

## Migración nueva

```bash
npm run db:migrate
```

Ejecuta también:

```text
database/migrations/004_create_envios_resenas_notificaciones_logs.sql
```

Crea las tablas:

- `envios`
- `resenas`
- `notificaciones`
- `logs_acciones`

No contiene `DROP DATABASE` ni `DROP TABLE`.

## Script para pedidos pagados antiguos sin envío

```bash
node scripts/createMissingShipments.js
```

Busca pedidos pagados sin envíos, crea un envío por tienda y no duplica registros.

## Endpoints de envíos

```text
GET   /api/v1/shipments/my-shipments
GET   /api/v1/seller/shipments
PATCH /api/v1/shipments/:id/dispatch
PATCH /api/v1/shipments/:id/status
```

Ejemplo registrar guía:

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/1/dispatch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_..." \
  -d '{"transportadora":"Servientrega","numero_guia":"GUIA123"}'
```

## Endpoints de reseñas

```text
POST  /api/v1/reviews
GET   /api/v1/products/:id/reviews
PATCH /api/v1/admin/reviews/:id/moderate
```

Reglas:

- Solo comprador autenticado puede crear reseña.
- El pedido debe pertenecer al comprador.
- El pedido debe estar pagado.
- El producto debe estar en el pedido.
- El envío de la tienda debe estar entregado.
- No se permiten reseñas duplicadas para el mismo producto, comprador y pedido.
- El comprador no puede ser dueño de la tienda del producto.

## Endpoint de reputación

```text
GET /api/v1/stores/:id/reputation
```

Niveles:

- `platino`: promedio >= 4.5
- `oro`: promedio >= 4.0 y < 4.5
- `regular`: promedio < 4.0 o sin reseñas

## Endpoints de notificaciones

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
```

Eventos básicos:

- pago aprobado o rechazado,
- nuevo pedido para vendedor,
- cambio de estado de envío,
- nueva reseña para vendedor,
- producto agotado para vendedor.

## Endpoint de logs

```text
GET /api/v1/admin/logs
```

Solo administrador. Lista eventos importantes como creación de pedido, pagos, envíos y reseñas.

## Ejemplo crear reseña

```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_..." \
  -d '{"producto_id":1,"pedido_id":1,"estrellas":5,"comentario":"Excelente producto"}'
```
