# 03 - Modelo Base de Datos CommerCity

## 1. Motor definido

Base de datos: MySQL.

El modelo debe ser relacional, normalizado y preparado para múltiples tiendas, múltiples compradores, pedidos multi-vendedor, pagos simulados, envíos por tienda y reseñas verificadas.

## 2. Convenciones

- Nombres de tablas en plural y minúsculas.
- Llaves primarias: `id`.
- Llaves foráneas: `<entidad>_id`.
- Fechas estándar: `created_at`, `updated_at`.
- Estados controlados con ENUM o catálogos.
- Índices en campos de búsqueda y relación.
- No almacenar datos sensibles innecesarios.

## 3. Tablas principales

### roles

Define los roles base del sistema.

Campos recomendados:

- `id`
- `nombre`: comprador, vendedor, administrador
- `descripcion`
- `created_at`

Datos iniciales por seed:

- comprador
- vendedor
- administrador

### usuarios

Almacena datos de acceso y perfil básico.

Campos recomendados:

- `id`
- `rol_id`
- `nombre`
- `correo`
- `password_hash`
- `telefono`
- `estado`: activo, bloqueado, inactivo
- `created_at`
- `updated_at`

Restricciones:

- `correo` único.
- No exponer `password_hash` en API.

### tiendas

Representa la marca comercial de cada vendedor.

Campos recomendados:

- `id`
- `usuario_id`
- `nombre`
- `slug`
- `descripcion`
- `logo_url`
- `banner_url`
- `estado`: activa, pausada, suspendida
- `reputacion_promedio`
- `nivel_reputacion`: platino, oro, regular
- `created_at`
- `updated_at`

Restricciones:

- `usuario_id` único para garantizar una tienda por vendedor.
- `nombre` o `slug` único.

### categorias

Categorías globales creadas por administrador.

Campos recomendados:

- `id`
- `nombre`
- `slug`
- `descripcion`
- `estado`: activa, inactiva
- `created_at`
- `updated_at`

### productos

Productos publicados por cada tienda.

Campos recomendados:

- `id`
- `tienda_id`
- `categoria_id`
- `nombre`
- `slug`
- `descripcion`
- `precio`
- `stock`
- `estado`: activo, agotado, oculto, eliminado
- `imagen_url`
- `calificacion_promedio`
- `total_resenas`
- `created_at`
- `updated_at`

Índices recomendados:

- `tienda_id`
- `categoria_id`
- `estado`
- `nombre`
- `precio`

### direcciones

Direcciones del comprador.

Campos recomendados:

- `id`
- `usuario_id`
- `departamento`
- `ciudad`
- `direccion`
- `codigo_postal`
- `telefono`
- `es_principal`
- `created_at`
- `updated_at`

### pedidos

Orden maestra de compra.

Campos recomendados:

- `id`
- `comprador_id`
- `direccion_id`
- `total`
- `estado_pago`: pendiente, pagado, rechazado, reembolsado
- `estado_general`: creado, procesando, enviado, completado, cancelado
- `created_at`
- `updated_at`

Índices recomendados:

- `comprador_id`
- `estado_pago`
- `estado_general`

### pedido_detalles

Líneas de productos comprados.

Campos recomendados:

- `id`
- `pedido_id`
- `producto_id`
- `tienda_id`
- `cantidad`
- `precio_unitario`
- `subtotal`
- `created_at`

Regla importante:

- `precio_unitario` conserva el precio exacto al momento de compra.

### pagos

Resultado de la pasarela sandbox.

Campos recomendados:

- `id`
- `pedido_id`
- `metodo`
- `referencia`
- `estado`: pendiente, aprobado, rechazado
- `mensaje`
- `created_at`

Regla importante:

- No almacenar números reales de tarjeta.

### comisiones

Distribución financiera simulada por tienda.

Campos recomendados:

- `id`
- `pedido_id`
- `tienda_id`
- `subtotal_tienda`
- `porcentaje_comision`
- `valor_comision`
- `valor_vendedor`
- `created_at`

### envios

Órdenes de envío por tienda.

Campos recomendados:

- `id`
- `pedido_id`
- `tienda_id`
- `direccion_id`
- `transportadora`
- `numero_guia`
- `estado`: pendiente, preparado, en_camino, entregado, cancelado
- `fecha_envio`
- `fecha_entrega`
- `created_at`
- `updated_at`

### resenas

Calificaciones de productos comprados.

Campos recomendados:

- `id`
- `producto_id`
- `comprador_id`
- `pedido_id`
- `estrellas`
- `comentario`
- `estado`: pendiente, aprobada, rechazada, ocultada
- `created_at`
- `updated_at`

Restricciones:

- `estrellas` entre 1 y 5.
- Validar compra pagada y entrega completada antes de crear.

### notificaciones

Eventos visibles para usuarios.

Campos recomendados:

- `id`
- `usuario_id`
- `tipo`
- `titulo`
- `mensaje`
- `leida`
- `created_at`

### logs_acciones

Registro básico de eventos importantes.

Campos recomendados:

- `id`
- `usuario_id`
- `accion`
- `entidad`
- `entidad_id`
- `detalle`
- `ip`
- `created_at`

## 4. Relaciones principales

- `roles 1 - N usuarios`
- `usuarios 1 - 1 tiendas`
- `tiendas 1 - N productos`
- `categorias 1 - N productos`
- `usuarios 1 - N direcciones`
- `usuarios 1 - N pedidos`
- `pedidos 1 - N pedido_detalles`
- `pedidos 1 - N pagos`
- `pedidos 1 - N envios`
- `pedidos 1 - N comisiones`
- `productos 1 - N resenas`
- `tiendas 1 - N comisiones`
- `usuarios 1 - N notificaciones`
- `usuarios 1 - N logs_acciones`

## 5. Procesos que requieren transacción

### Pago aprobado

Debe ejecutarse como una operación atómica:

1. Validar pedido pendiente.
2. Validar stock actual.
3. Registrar pago aprobado.
4. Actualizar estado del pedido a pagado.
5. Descontar stock.
6. Marcar productos agotados si stock llega a cero.
7. Crear comisiones por tienda.
8. Crear envíos por tienda.
9. Confirmar transacción.

Si algo falla, hacer rollback.

### Creación de pedido

1. Validar carrito.
2. Crear pedido pendiente.
3. Crear detalles con precio histórico.
4. Confirmar total.

## 6. Índices recomendados

- `usuarios.correo`
- `usuarios.rol_id`
- `tiendas.usuario_id`
- `tiendas.slug`
- `productos.tienda_id`
- `productos.categoria_id`
- `productos.estado`
- `productos.nombre`
- `pedidos.comprador_id`
- `pedido_detalles.pedido_id`
- `pedido_detalles.tienda_id`
- `envios.pedido_id`
- `envios.tienda_id`
- `resenas.producto_id`
- `resenas.comprador_id`

## 7. Semillas iniciales

Semillas mínimas:

- Roles: comprador, vendedor, administrador.
- Usuario administrador general.
- Categorías iniciales de ejemplo.
- Productos y tiendas demo opcionales para pruebas.

## 8. Recomendación final

No empezar a programar pedidos, pagos o envíos hasta validar este modelo, porque esas funciones dependen de relaciones correctas entre usuarios, tiendas, productos, pedidos y direcciones.
