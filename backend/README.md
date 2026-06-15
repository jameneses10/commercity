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


---

# Fase 6.1A - Seguridad, perfiles y ajustes de cuenta

## Migración nueva

```bash
npm run db:migrate
```

Archivo:

```text
database/migrations/005_create_fase_6_1A_seguridad_perfiles.sql
```

## Columnas nuevas en usuarios

```text
acepta_terminos
terminos_version
terminos_aceptados_at
deleted_at
ultimo_login_at
```

La desactivación de cuenta es lógica: se marca `estado = inactivo` y `deleted_at = NOW()`.

## Tablas nuevas

```text
password_reset_tokens
perfiles_usuarios
terminos_aceptaciones
```

## Registro con términos

`POST /api/v1/auth/register` exige aceptación explícita:

```json
{
  "nombre": "Comprador Demo",
  "correo": "comprador@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "rol": "comprador",
  "acepta_terminos": true,
  "terminos_version": "v1.0"
}
```

No se permite registro público como administrador.

## Recuperación de contraseña MVP académico

### Solicitar código

```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@example.com"}'
```

La respuesta siempre es genérica, exista o no el correo. En `NODE_ENV=development`, la API devuelve `debug_reset_code` para simular el correo sin SMTP real. No se guardan tokens ni códigos en texto plano.

### Restablecer contraseña

```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@example.com","codigo":"123456","password":"NuevaPassword123!","confirmPassword":"NuevaPassword123!"}'
```

## Cambio de contraseña autenticado

```text
POST /api/v1/auth/change-password
```

Requiere JWT y valida contraseña actual.

## Ajustes de cuenta

```text
GET   /api/v1/account/settings
PATCH /api/v1/account/settings
PATCH /api/v1/account/deactivate
POST  /api/v1/account/upgrade-to-seller
```

`upgrade-to-seller` cambia un comprador activo a vendedor si acepta condiciones. No crea tienda automáticamente.

## Perfiles

```text
GET   /api/v1/profiles/me
PATCH /api/v1/profiles/me
GET   /api/v1/profiles/:userId
```

El perfil público no expone correo, teléfono, `password_hash`, tokens ni datos sensibles.

## Frontend web Fase 6.1A

Páginas nuevas:

```text
frontend-web/pages/forgot-password.html
frontend-web/pages/reset-password.html
frontend-web/pages/profile.html
frontend-web/pages/public-profile.html
frontend-web/pages/account-settings.html
```

Scripts nuevos:

```text
frontend-web/js/api/account.api.js
frontend-web/js/api/profiles.api.js
frontend-web/js/pages/forgot-password.js
frontend-web/js/pages/reset-password.js
frontend-web/js/pages/profile.js
frontend-web/js/pages/public-profile.js
frontend-web/js/pages/account-settings.js
```

El registro web ahora exige aceptar términos versión `v1.0`.


---

# Fase 6.1B - Tiendas, productos ampliados, estadísticas, ganancias y reportes

## Migración nueva

```bash
npm run db:migrate
```

Archivo:

```text
database/migrations/006_create_fase_6_1B_tienda_productos_estadisticas.sql
```

## Columnas nuevas en productos

```text
precio_anterior
descuento_porcentaje
fecha_publicacion
fecha_caducidad
reportado
total_reportes
```

Reglas:

- `descuento_porcentaje` debe estar entre 0 y 100.
- `precio_final` se calcula en consultas como precio con descuento si aplica.
- Si no hay descuento, `precio_final = precio`.
- `fecha_caducidad` es opcional.
- El catálogo público oculta productos caducados y productos ocultos/eliminados.
- Los productos agotados pueden aparecer, marcados con estado `agotado`.

## Tablas nuevas

```text
cuentas_bancarias_vendedores
reportes_productos
```

## Estadísticas y ganancias vendedor

```text
GET /api/v1/seller/store/stats
GET /api/v1/seller/store/earnings
GET /api/v1/seller/store/out-of-stock-products
GET /api/v1/seller/store/sold-products
```

Los cálculos se basan en pedidos pagados, `pedido_detalles`, `comisiones` y productos de la tienda del vendedor.

Regla académica de ganancias:

```text
10% comisión plataforma
90% ganancia vendedor
```

## Cuenta bancaria simulada

```text
GET   /api/v1/seller/bank-account
POST  /api/v1/seller/bank-account
PATCH /api/v1/seller/bank-account
```

La cuenta bancaria es simulada y solo para fines académicos. No se debe ingresar información financiera real.

## Reportes de productos

```text
POST  /api/v1/products/:id/report
GET   /api/v1/admin/reports/products
PATCH /api/v1/admin/reports/products/:id
```

Estados:

```text
pendiente
revisado
rechazado
accionado
```

Al reportar producto:

- se crea reporte,
- se incrementa `total_reportes`,
- se marca `reportado = true`,
- se notifica a administradores activos,
- se registra log.

Si el admin marca reporte como `accionado` con `ocultar_producto = true`, el producto pasa a estado `oculto`.

## Frontend web Fase 6.1B

Páginas nuevas/entradas:

```text
frontend-web/pages/seller-store-stats.html
frontend-web/pages/seller-earnings.html
frontend-web/pages/product-report.html
frontend-web/pages/seller-bank-account.html
frontend-web/pages/admin-product-reports.html
```

APIs frontend nuevas:

```text
frontend-web/js/api/sellerStats.api.js
frontend-web/js/api/bankAccount.api.js
frontend-web/js/api/productReports.api.js
```

Páginas/componentes actualizados:

```text
frontend-web/components/product-card.js
frontend-web/js/pages/product-detail.js
frontend-web/js/pages/seller-dashboard.js
frontend-web/js/pages/admin-dashboard.js
```

## Fase 6.1C - Social, chat, administración y notificaciones ampliadas

Migración segura:

```text
backend/database/migrations/007_create_fase_6_1C_social_chat_admin_notificaciones.sql
```

Esta fase agrega interacción social y comunicación interna sin app móvil ni WebSockets.

### Tablas nuevas

- `seguimientos`: relación seguidor/seguido, con unicidad para evitar duplicados.
- `conversaciones`: conversaciones básicas entre comprador y vendedor, opcionalmente asociadas a tienda o producto.
- `mensajes_chat`: mensajes persistidos en base de datos, con estado `leido` y `leido_at`.
- `reportes_usuarios`: reportes entre usuarios con estados `pendiente`, `revisado`, `rechazado`, `accionado`.

### Cambios seguros en tablas existentes

- `notificaciones` agrega campos opcionales:
  - `entidad_tipo`
  - `entidad_id`
  - `url_destino`
  - `deleted_at`
- `usuarios.estado` permite también `baneado` para gestión administrativa.

No se usan `DROP DATABASE` ni `DROP TABLE`.

### Seguidores

Endpoints:

```text
POST   /api/v1/profiles/:userId/follow
DELETE /api/v1/profiles/:userId/follow
GET    /api/v1/profiles/:userId/followers
GET    /api/v1/profiles/:userId/following
GET    /api/v1/profiles/:userId
```

Reglas:

- No se permite seguirse a sí mismo.
- No se duplica seguimiento.
- El perfil público incluye `total_seguidores`, `total_siguiendo` e `is_following` cuando hay token válido.
- Se genera notificación de nuevo seguidor.

### Chat interno básico

Endpoints:

```text
GET   /api/v1/chat/conversations
POST  /api/v1/chat/conversations
GET   /api/v1/chat/conversations/:id/messages
POST  /api/v1/chat/conversations/:id/messages
PATCH /api/v1/chat/conversations/:id/read
```

Reglas:

- Chat básico persistido en MySQL.
- No es tiempo real.
- No usa WebSockets.
- Solo participantes pueden listar, leer o enviar mensajes.
- Valida mensajes no vacíos y máximo 1000 caracteres.
- Crea notificación al receptor.
- Registra log básico.

### Reportes de usuarios

Endpoints:

```text
POST  /api/v1/users/:id/report
GET   /api/v1/admin/reports/users
PATCH /api/v1/admin/reports/users/:id
```

Reglas:

- No se permite auto-reporte.
- Evita duplicados pendientes/revisados del mismo reportante hacia el mismo reportado.
- Admin puede revisar, rechazar o accionar.
- Si admin acciona con `inactivar_usuario=true`, el usuario reportado pasa a `inactivo`.
- Se notifican administradores y usuarios afectados cuando corresponde.

### Dashboard administrativo ampliado

Endpoints:

```text
GET   /api/v1/admin/dashboard-stats
GET   /api/v1/admin/search?q=texto
GET   /api/v1/admin/users
PATCH /api/v1/admin/users/:id/status
```

`GET /api/v1/admin/dashboard-stats` devuelve:

- `total_compradores`
- `total_vendedores`
- `total_administradores`
- `total_usuarios_activos`
- `total_usuarios_inactivos`
- `total_tiendas`
- `total_productos`
- `total_productos_activos`
- `total_productos_agotados`
- `total_pedidos`
- `ventas_totales`
- `comisiones_totales`
- `reportes_productos_pendientes`
- `reportes_usuarios_pendientes`

`GET /api/v1/admin/search?q=` busca usuarios, productos y tiendas sin exponer `password_hash` ni datos sensibles.

`PATCH /api/v1/admin/users/:id/status` permite:

- `activo`
- `inactivo`
- `baneado`

Reglas:

- Admin no puede inactivarse o banearse a sí mismo.
- Usuario inactivo o baneado no puede iniciar sesión.
- Se registra log y se notifica al usuario cuando aplica.

### Notificaciones ampliadas

Endpoints nuevos:

```text
GET    /api/v1/notifications/unread-count
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
DELETE /api/v1/notifications
```

Se mantienen:

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
```

Reglas:

- Contador de no leídas.
- Marcar individual como leída.
- Marcar todas como leídas.
- Eliminación lógica individual o total con `deleted_at`.
- Notificaciones para nuevo mensaje, nuevo seguidor, reportes, cambios de estado de cuenta y respuestas administrativas.

### Frontend web Fase 6.1C

Páginas nuevas:

```text
frontend-web/pages/chat.html
frontend-web/pages/conversation.html
frontend-web/pages/followers.html
frontend-web/pages/following.html
frontend-web/pages/admin-reports-users.html
frontend-web/pages/admin-search.html
frontend-web/pages/admin-users.html
frontend-web/pages/notifications.html
```

APIs frontend nuevas:

```text
frontend-web/js/api/chat.api.js
frontend-web/js/api/follow.api.js
frontend-web/js/api/userReports.api.js
frontend-web/js/api/adminStats.api.js
frontend-web/js/api/adminSearch.api.js
```

Scripts nuevos:

```text
frontend-web/js/pages/chat.js
frontend-web/js/pages/conversation.js
frontend-web/js/pages/followers.js
frontend-web/js/pages/following.js
frontend-web/js/pages/admin-reports-users.js
frontend-web/js/pages/admin-search.js
frontend-web/js/pages/admin-users.js
frontend-web/js/pages/notifications.js
```

Frontend existente actualizado:

- Header con acceso a chat y contador de notificaciones.
- Perfil público con seguir/dejar de seguir, contadores, reportar usuario y mensaje a vendedor.
- Panel comprador con acceso a chat/notificaciones.
- Panel vendedor con acceso a chat, notificaciones, estadísticas, ganancias y cuenta bancaria simulada.
- Panel admin con estadísticas, reportes de usuarios, búsqueda global y gestión de usuarios.

### Limitaciones Fase 6.1C

- Chat no es tiempo real.
- No hay WebSockets.
- No hay app móvil.
- No hay push notifications externas.
- Notificaciones son internas en base de datos.
- La gestión administrativa avanzada se limita a estadísticas, búsqueda, reportes y estado de usuarios.

## Fase backend posterior a 6.1C - Uploads, edad vendedor y chat multimedia

Esta fase prepara únicamente el backend para nuevos requerimientos del documento actualizado. No incluye rediseño frontend ni app móvil.

### Requisitos cubiertos

- RF-018: restricción de edad para vendedores.
- RF-023 / RF-024: logo y banner de tienda por URL o archivo de imagen.
- RF-036: múltiples imágenes de producto.
- RF-161: foto de perfil y descripción personal.
- RF-167: archivos multimedia/documentos en chat.
- RF-168: soporte de emojis nativos en chat.

### Dependencia nueva

```bash
npm install multer
```

### Migración

```text
database/migrations/008_backend_uploads_chat_age.sql
```

Cambios aplicados sin `DROP DATABASE` ni `DROP TABLE`:

- `usuarios.fecha_nacimiento DATE NULL`
- `perfiles_usuarios.foto_perfil_url VARCHAR(500) NULL`
- `perfiles_usuarios.descripcion_personal TEXT NULL`
- Tabla `producto_imagenes`
- Tabla `mensajes`
- Tabla `mensaje_archivos`
- Campos compatibles en `conversaciones`: `estado`, `creado_en`, `actualizado_en`

### Uploads seguros

Middleware reutilizable:

```text
src/middlewares/upload.middleware.js
```

Carpetas:

```text
uploads/stores
uploads/products
uploads/profiles
uploads/chat
```

Reglas:

- No se guardan archivos dentro de `src`.
- Las rutas públicas se exponen desde `/uploads`.
- Nombres finales generados por el sistema.
- El nombre original se guarda solo como metadata cuando aplica.
- Bloqueados: `.exe`, `.sh`, `.bat`, `.php`, `.js`, `.html`.
- Imágenes permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Chat permite además: `.pdf`, `.doc`, `.docx`.
- Tamaños máximos: tienda/producto 5MB, perfil 3MB, chat 10MB por archivo.

### Registro vendedor con edad mínima

`POST /api/v1/auth/register` ahora acepta:

```json
{
  "fecha_nacimiento": "1995-01-01"
}
```

Reglas:

- Si `rol = vendedor`, `fecha_nacimiento` es obligatoria.
- El vendedor debe ser mayor de 18 años.
- Comprador puede registrarse sin fecha de nacimiento.
- Registro público como administrador sigue bloqueado.

### Tiendas con logo y banner por archivo

Endpoints modificados:

```text
POST  /api/v1/stores
PATCH /api/v1/stores/me
```

Aceptan `multipart/form-data`:

- `logo`: archivo de imagen.
- `banner`: archivo de imagen.
- `logo_url`: URL http/https.
- `banner_url`: URL http/https.

Si se envía archivo, se guarda una ruta como:

```text
/uploads/stores/<nombre_seguro>.png
```

### Productos con múltiples imágenes

Endpoints modificados:

```text
POST  /api/v1/products
PATCH /api/v1/products/:id
GET   /api/v1/products
GET   /api/v1/products/:id
DELETE /api/v1/products/:id/images/:imageId
```

Reglas:

- Campo multipart: `images`.
- Máximo 6 imágenes por producto.
- `GET /products` y `GET /products/:id` devuelven `imagenes`.
- Se mantiene compatibilidad con `imagen_url` heredado.
- Solo vendedor dueño o administrador puede eliminar una imagen de producto.

### Perfil de usuario con foto

Endpoint nuevo compatible:

```text
PATCH /api/v1/profile
GET   /api/v1/profile
```

También se mantiene:

```text
PATCH /api/v1/profiles/me
GET   /api/v1/profiles/me
```

Acepta:

- `foto`: archivo de imagen.
- `foto_perfil_url`: URL opcional.
- `descripcion_personal`: texto opcional.

`GET /api/v1/auth/me` devuelve `foto_perfil_url` y `descripcion_personal` cuando existen.

### Chat con archivos y emojis

Endpoints modificados/agregados:

```text
POST   /api/v1/chat/conversations
GET    /api/v1/chat/conversations
GET    /api/v1/chat/conversations/:id/messages
POST   /api/v1/chat/conversations/:id/messages
PATCH  /api/v1/chat/conversations/:id/read
PATCH  /api/v1/chat/messages/:id/report
DELETE /api/v1/chat/messages/:id
```

`POST /chat/conversations/:id/messages` acepta `multipart/form-data`:

- `mensaje` o `contenido`: texto, permite emojis nativos como `Hola 👋😊🔥`.
- `files`: archivos adjuntos, máximo 5 por petición.

Reglas:

- Solo comprador y vendedor participantes pueden ver y enviar mensajes.
- No se permiten mensajes vacíos sin archivos.
- No se destruyen emojis en validación.
- Los archivos se guardan en `uploads/chat`.
- Se permite reportar o eliminar mensajes.
- La eliminación de mensajes es lógica (`eliminado=true`).

