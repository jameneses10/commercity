# 04 - Plan de API REST CommerCity

## 1. Convenciones generales

Base sugerida:

```text
/api/v1
```

Formato de respuesta exitosa:

```json
{
  "ok": true,
  "message": "Operación realizada correctamente",
  "data": {}
}
```

Formato de error:

```json
{
  "ok": false,
  "message": "Descripción clara del error",
  "errors": []
}
```

Códigos HTTP:

- `200 OK`: consulta o actualización exitosa.
- `201 Created`: recurso creado.
- `204 No Content`: eliminación o acción sin cuerpo.
- `400 Bad Request`: datos inválidos.
- `401 Unauthorized`: sin token o token inválido.
- `403 Forbidden`: rol no autorizado.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: conflicto de unicidad o estado.
- `500 Internal Server Error`: error no controlado.

## 2. Seguridad de API

Todas las rutas privadas deben recibir:

```text
Authorization: Bearer JWT_TOKEN
```

El JWT debe incluir:

- `id`
- `correo`
- `rol`

No debe incluir:

- `password_hash`
- datos sensibles
- secretos del servidor

## 3. Autenticación

### POST `/api/v1/auth/register`

Registra comprador o vendedor.

Roles permitidos desde interfaz pública:

- comprador
- vendedor

No permite administrador.

### POST `/api/v1/auth/login`

Inicia sesión y devuelve JWT.

### GET `/api/v1/auth/me`

Devuelve perfil del usuario autenticado.

### POST `/api/v1/auth/logout`

Cierre lógico desde cliente. En JWT stateless puede ser manejado limpiando token en cliente.

## 4. Usuarios y administración

### GET `/api/v1/admin/users`

Lista usuarios. Solo administrador.

### PATCH `/api/v1/admin/users/:id/status`

Activa, bloquea o inactiva usuario. Solo administrador.

### GET `/api/v1/admin/sellers`

Lista vendedores.

### GET `/api/v1/admin/buyers`

Lista compradores.

## 5. Tiendas

### POST `/api/v1/stores`

Crea tienda del vendedor autenticado.

### GET `/api/v1/stores/:id`

Consulta perfil público de tienda.

### PATCH `/api/v1/stores/me`

Edita tienda propia del vendedor.

### PATCH `/api/v1/stores/:id/pause`

Pausa tienda. Vendedor propietario o administrador.

### PATCH `/api/v1/stores/:id/activate`

Reactiva tienda. Vendedor propietario o administrador según política.

### GET `/api/v1/stores/:id/products`

Lista productos de una tienda.

## 6. Categorías

### GET `/api/v1/categories`

Lista categorías activas.

### POST `/api/v1/categories`

Crea categoría. Solo administrador.

### PATCH `/api/v1/categories/:id`

Actualiza categoría. Solo administrador.

### DELETE `/api/v1/categories/:id`

Elimina categoría si no tiene productos activos. Solo administrador.

## 7. Productos

### GET `/api/v1/products`

Busca productos activos con filtros:

- `q`
- `category_id`
- `store_id`
- `min_price`
- `max_price`
- `sort`
- `page`
- `limit`

### GET `/api/v1/products/:id`

Detalle de producto.

### POST `/api/v1/products`

Crea producto. Solo vendedor con tienda activa.

### PATCH `/api/v1/products/:id`

Edita producto propio.

### PATCH `/api/v1/products/:id/visibility`

Activa, oculta o marca producto según estado.

### DELETE `/api/v1/products/:id`

Elimina u oculta producto propio. Recomendado: borrado lógico.

## 8. Carrito

El carrito vive principalmente en cliente, pero debe validarse en backend.

### POST `/api/v1/cart/validate`

Valida:

- Productos existen.
- Productos activos.
- Tiendas activas.
- Stock disponible.
- Precio actual.
- Cambios de precio o estado.

## 9. Direcciones

### GET `/api/v1/addresses`

Lista direcciones del comprador autenticado.

### POST `/api/v1/addresses`

Crea dirección.

### PATCH `/api/v1/addresses/:id`

Actualiza dirección propia.

### DELETE `/api/v1/addresses/:id`

Elimina dirección propia si no rompe integridad histórica.

## 10. Pedidos

### POST `/api/v1/orders`

Crea pedido pendiente desde carrito validado.

### GET `/api/v1/orders/my-orders`

Lista pedidos del comprador.

### GET `/api/v1/orders/:id`

Detalle del pedido según rol:

- comprador propietario.
- vendedor si participa su tienda.
- administrador.

### GET `/api/v1/seller/orders`

Lista pedidos relacionados con la tienda del vendedor.

### GET `/api/v1/admin/orders`

Lista todos los pedidos. Solo administrador.

## 11. Pagos sandbox

### POST `/api/v1/payments/sandbox`

Procesa pago simulado.

Reglas recomendadas:

- Tarjeta de prueba aprobada: `4111111111111111`.
- Tarjeta de prueba rechazada: `4000000000000002`.
- No guardar PAN completo.

### POST `/api/v1/payments/webhook-simulated`

Webhook simulado que actualiza pedido, descuenta stock, genera comisiones y crea envíos.

Debe protegerse para evitar ejecución pública no controlada.

## 12. Envíos

### GET `/api/v1/shipments/my-shipments`

Comprador consulta sus envíos.

### GET `/api/v1/seller/shipments`

Vendedor consulta envíos de su tienda.

### PATCH `/api/v1/shipments/:id/dispatch`

Vendedor registra transportadora y guía.

### PATCH `/api/v1/shipments/:id/status`

Actualiza estado de envío.

## 13. Reseñas y reputación

### POST `/api/v1/reviews`

Crea reseña con compra verificada.

### GET `/api/v1/products/:id/reviews`

Lista reseñas aprobadas del producto.

### PATCH `/api/v1/admin/reviews/:id/moderate`

Modera reseña. Solo administrador.

### GET `/api/v1/stores/:id/reputation`

Consulta reputación de tienda.

## 14. Reportes

### GET `/api/v1/seller/reports/sales`

Reporte básico de ventas por tienda.

### GET `/api/v1/seller/reports/out-of-stock`

Productos agotados.

### GET `/api/v1/admin/reports/sales`

Ventas generales simuladas.

### GET `/api/v1/admin/reports/top-products`

Productos más vendidos.

### GET `/api/v1/admin/reports/commissions`

Comisiones generadas.

## 15. Logs

### GET `/api/v1/admin/logs`

Consulta eventos importantes:

- registros
- compras
- pagos
- cambios de estado
- acciones administrativas

## 16. Orden recomendado de implementación de endpoints

1. `auth/register`, `auth/login`, `auth/me`.
2. `stores`.
3. `categories`.
4. `products`.
5. `cart/validate`.
6. `orders`.
7. `payments/sandbox`.
8. `shipments`.
9. `reviews`.
10. `admin/reports`.

## 17. Pruebas mínimas de API

- Registro comprador exitoso.
- Registro vendedor exitoso.
- Registro administrador rechazado.
- Login exitoso.
- Ruta privada sin token devuelve 401.
- Comprador intentando crear categoría devuelve 403.
- Vendedor intentando editar producto ajeno devuelve 403.
- Carrito con stock insuficiente devuelve 400.
- Pago aprobado descuenta stock y crea envíos.
- Pago rechazado no descuenta stock.
