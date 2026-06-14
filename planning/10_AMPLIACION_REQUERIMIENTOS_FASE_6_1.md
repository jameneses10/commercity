# Fase 6.1 - Ampliación funcional de CommerCity

> Documento de análisis y planeación. No contiene migraciones, código backend ni código frontend.  
> Objetivo: incorporar nuevos requerimientos de forma controlada sin romper lo construido en Fases 1 a 6.

## 1. Alcance general

La Fase 6.1 amplía CommerCity antes de iniciar la app móvil. Esta fase debe fortalecer el backend y la web responsive existente con funcionalidades de cuenta, perfiles, tienda, reportes, chat, seguidores, administración avanzada y estadísticas.

Restricciones obligatorias:

- No avanzar a Fase 7.
- No implementar app móvil.
- No borrar base de datos.
- No borrar tablas.
- No eliminar usuarios, productos, pedidos, pagos, envíos ni reseñas.
- No ejecutar `DROP DATABASE`.
- No ejecutar `DROP TABLE`.
- No exponer contraseñas, tokens, secrets ni datos sensibles.
- No romper login, registro, catálogo, carrito, checkout, pagos sandbox, envíos ni reseñas.

## 2. Subfases propuestas

### Fase 6.1A - Seguridad, perfiles y ajustes de cuenta

Objetivo: ampliar autenticación, recuperación de contraseña, aceptación de términos, perfiles de usuario, inactivación lógica de cuenta y cambio de rol comprador a vendedor.

Incluye:

- Recuperación y restablecimiento de contraseña con token/código temporal.
- Modo simulado seguro para recuperación sin SMTP real.
- Aceptación explícita de términos durante registro.
- Guardar versión y fecha de aceptación de términos.
- Perfil comprador/vendedor detallado.
- Foto de perfil y descripción personal.
- Perfil público de usuario.
- Eliminación lógica/inactivación de cuenta.
- Cambio de rol de comprador a vendedor aceptando condiciones de vendedor.
- Ajustes de cuenta en frontend web.

### Fase 6.1B - Tiendas, productos, estadísticas, ganancias y reportes

Objetivo: ampliar productos y tiendas, incorporar descuentos, cuenta bancaria simulada, reportes de productos y estadísticas comerciales básicas para vendedor.

Incluye:

- Campos adicionales de producto: descuento, fecha de publicación, fecha de caducidad opcional.
- Mostrar precio anterior y precio con descuento.
- Reportar productos.
- Estadísticas de tienda: ventas, ingresos brutos, comisión 10%, ganancia neta 90%, productos vendidos, productos agotados.
- Cuenta bancaria simulada del vendedor.
- Historial básico de ingresos por tienda.
- Notificaciones de ventas, stock bajo, producto agotado y reporte recibido.

### Fase 6.1C - Chat, seguidores, reportes, admin avanzado y notificaciones

Objetivo: incorporar interacción social, mensajería interna, reportes de usuarios, administración avanzada y notificaciones más completas.

Incluye:

- Chat interno básico comprador-vendedor, no tiempo real.
- Conversaciones por usuario.
- Seguir/dejar de seguir usuarios o vendedores.
- Contadores de seguidores y seguidos.
- Reportar usuarios.
- Gestión de reportes por administrador.
- Dashboard admin con estadísticas globales.
- Buscador global admin: usuarios, productos y tiendas.
- Banear/inactivar usuarios.
- Ocultar productos reportados.
- Notificaciones detalladas con acciones de lectura/eliminación.

## 3. Nuevas tablas necesarias

### 3.1 `password_reset_tokens`

Para recuperación de contraseña.

Campos sugeridos:

- `id`
- `usuario_id`
- `token_hash`
- `codigo_hash`
- `expires_at`
- `used_at`
- `created_at`
- `ip_solicitud`

Notas:

- Guardar hash del token/código, nunca el token plano.
- Expirar tokens en 15 a 30 minutos.
- En modo académico sin SMTP, mostrar el código una sola vez en respuesta controlada solo en entorno `development`.

### 3.2 `terminos_aceptaciones`

Para trazabilidad de aceptación de términos.

Campos sugeridos:

- `id`
- `usuario_id`
- `version_terminos`
- `aceptado_at`
- `ip`
- `user_agent`

### 3.3 `perfiles_usuarios`

Para datos extendidos de perfil.

Campos sugeridos:

- `id`
- `usuario_id`
- `foto_url`
- `descripcion`
- `ubicacion`
- `fecha_nacimiento` opcional
- `created_at`
- `updated_at`

### 3.4 `seguimientos`

Para seguidores y seguidos.

Campos sugeridos:

- `id`
- `seguidor_id`
- `seguido_id`
- `created_at`

Reglas:

- `seguidor_id` referencia usuarios.
- `seguido_id` referencia usuarios.
- Índice único `(seguidor_id, seguido_id)`.
- Impedir seguirse a sí mismo.

### 3.5 `cuentas_bancarias_vendedores`

Cuenta bancaria simulada del vendedor.

Campos sugeridos:

- `id`
- `usuario_id`
- `tienda_id`
- `banco`
- `tipo_cuenta`
- `numero_cuenta_simulado`
- `titular`
- `created_at`
- `updated_at`

Notas:

- No manejar dinero real.
- No almacenar datos financieros reales.

### 3.6 `reportes_productos`

Reportes de productos hechos por usuarios.

Campos sugeridos:

- `id`
- `producto_id`
- `reportante_id`
- `motivo`
- `descripcion`
- `estado`
- `respuesta_admin`
- `admin_id`
- `created_at`
- `updated_at`

Estados sugeridos:

- `pendiente`
- `en_revision`
- `resuelto`
- `rechazado`

### 3.7 `reportes_usuarios`

Reportes de usuarios.

Campos sugeridos:

- `id`
- `usuario_reportado_id`
- `reportante_id`
- `motivo`
- `descripcion`
- `estado`
- `respuesta_admin`
- `admin_id`
- `created_at`
- `updated_at`

### 3.8 `conversaciones`

Para chat interno.

Campos sugeridos:

- `id`
- `comprador_id`
- `vendedor_id`
- `tienda_id` opcional
- `producto_id` opcional
- `created_at`
- `updated_at`

Reglas:

- Una conversación puede asociarse a un producto o tienda.
- Debe evitar duplicados innecesarios según par comprador-vendedor-producto.

### 3.9 `mensajes_chat`

Mensajes de chat.

Campos sugeridos:

- `id`
- `conversacion_id`
- `remitente_id`
- `mensaje`
- `leido`
- `created_at`

Reglas:

- No permitir mensajes vacíos.
- No guardar datos sensibles.

### 3.10 `ingresos_vendedor`

Opcional si se decide materializar ingresos en vez de calcular desde `comisiones`.

Campos sugeridos:

- `id`
- `pedido_id`
- `tienda_id`
- `subtotal_tienda`
- `comision_plataforma`
- `ganancia_vendedor`
- `estado`
- `created_at`

Notas:

- Para MVP puede evitarse esta tabla y calcular desde `comisiones` + `pedido_detalles`.

## 4. Tablas existentes que se deben modificar

### 4.1 `usuarios`

Campos sugeridos:

- `estado` ENUM: `activo`, `inactivo`, `baneado`
- `deleted_at` o `inactivated_at`
- `ultimo_login_at` opcional
- `terminos_version`
- `terminos_aceptados_at`

Impacto:

- Login debe impedir usuarios `inactivo` o `baneado`.
- La eliminación de cuenta debe ser lógica.

### 4.2 `productos`

Campos sugeridos:

- `descuento_porcentaje` DECIMAL(5,2) default 0
- `precio_anterior` DECIMAL(12,2) opcional
- `fecha_publicacion` DATETIME
- `fecha_caducidad` DATETIME opcional
- `reportes_count` INT default 0

Impacto:

- Catálogo debe mostrar precio final calculado.
- El backend debe validar descuentos entre 0 y 100.
- Productos vencidos podrían ocultarse o marcarse no disponibles según decisión MVP.

### 4.3 `tiendas`

Campos sugeridos:

- `descripcion_larga` opcional
- `politicas_tienda` opcional
- `reportes_count` opcional

### 4.4 `notificaciones`

Campos sugeridos:

- `descripcion` TEXT opcional
- `entidad` VARCHAR opcional
- `entidad_id` INT opcional
- `url_destino` VARCHAR opcional
- `deleted_at` DATETIME opcional

Impacto:

- Permitir eliminar individual y masivamente sin borrado físico.
- Permitir clic hacia sección relacionada.

### 4.5 `logs_acciones`

Puede mantenerse como está, pero se recomienda ampliar uso para:

- recuperación de contraseña solicitada,
- restablecimiento exitoso,
- cambio de rol,
- inactivación de cuenta,
- reporte creado,
- reporte gestionado,
- usuario baneado,
- producto ocultado.

## 5. Nuevos endpoints backend sugeridos

### 5.1 Autenticación y cuenta

```text
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/change-password
POST   /api/v1/auth/accept-terms
GET    /api/v1/account/settings
PATCH  /api/v1/account/settings
PATCH  /api/v1/account/deactivate
POST   /api/v1/account/upgrade-to-seller
```

### 5.2 Perfiles

```text
GET    /api/v1/profiles/me
PATCH  /api/v1/profiles/me
GET    /api/v1/profiles/:userId
GET    /api/v1/profiles/:userId/followers
GET    /api/v1/profiles/:userId/following
POST   /api/v1/profiles/:userId/follow
DELETE /api/v1/profiles/:userId/follow
GET    /api/v1/profiles/me/purchased-products
GET    /api/v1/profiles/me/published-products
```

### 5.3 Tiendas y estadísticas

```text
GET   /api/v1/seller/store/stats
GET   /api/v1/seller/store/earnings
GET   /api/v1/seller/store/sold-products
GET   /api/v1/seller/store/out-of-stock-products
GET   /api/v1/seller/bank-account
POST  /api/v1/seller/bank-account
PATCH /api/v1/seller/bank-account
```

### 5.4 Productos ampliados

```text
PATCH /api/v1/products/:id/discount
POST  /api/v1/products/:id/report
```

### 5.5 Chat

```text
GET  /api/v1/chat/conversations
POST /api/v1/chat/conversations
GET  /api/v1/chat/conversations/:id/messages
POST /api/v1/chat/conversations/:id/messages
PATCH /api/v1/chat/conversations/:id/read
```

### 5.6 Reportes de usuarios

```text
POST /api/v1/users/:id/report
```

### 5.7 Notificaciones ampliadas

```text
GET    /api/v1/notifications/unread-count
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
DELETE /api/v1/notifications
```

### 5.8 Administración ampliada

```text
GET   /api/v1/admin/dashboard-stats
GET   /api/v1/admin/reports/products
GET   /api/v1/admin/reports/users
PATCH /api/v1/admin/reports/products/:id
PATCH /api/v1/admin/reports/users/:id
GET   /api/v1/admin/search
PATCH /api/v1/admin/users/:id/status
PATCH /api/v1/admin/products/:id/hide
```

## 6. Endpoints existentes que se deben ajustar

### 6.1 `POST /api/v1/auth/register`

Ajustes:

- Requerir aceptación de términos.
- Recibir `terms_accepted: true`.
- Guardar versión de términos.
- No permitir registro sin aceptación.

### 6.2 `POST /api/v1/auth/login`

Ajustes:

- Validar `usuarios.estado`.
- Bloquear login de usuarios `inactivo` o `baneado`.
- Opcional: actualizar `ultimo_login_at`.

### 6.3 `GET /api/v1/auth/me`

Ajustes:

- Incluir campos básicos de perfil y estado.
- No exponer datos sensibles.

### 6.4 `GET /api/v1/products`

Ajustes:

- Soportar búsqueda por vendedor/tienda.
- Incluir precio con descuento.
- Excluir productos vencidos si se decide ocultarlos.

### 6.5 `GET /api/v1/products/:id`

Ajustes:

- Incluir descuento, precio anterior, precio final.
- Incluir vendedor/tienda con enlace a perfil público.
- Incluir estado disponible/agotado.

### 6.6 `POST /api/v1/products`

Ajustes:

- Permitir descuento opcional.
- Permitir fecha de caducidad opcional.
- Validar descuento y fechas.

### 6.7 `PATCH /api/v1/products/:id`

Ajustes:

- Permitir actualización de descuento y fechas si el vendedor es propietario.

### 6.8 `GET /api/v1/notifications`

Ajustes:

- Incluir descripción, entidad, URL destino y contador.
- Excluir notificaciones eliminadas lógicamente.

### 6.9 `GET /api/v1/stores/:id`

Ajustes:

- Incluir perfil público del vendedor.
- Incluir contadores y reputación ampliada.

## 7. Nuevas páginas o secciones frontend

### 7.1 Fase 6.1A

Nuevas páginas:

```text
frontend-web/pages/forgot-password.html
frontend-web/pages/reset-password.html
frontend-web/pages/profile.html
frontend-web/pages/public-profile.html
frontend-web/pages/account-settings.html
```

Secciones modificadas:

```text
frontend-web/pages/register.html
frontend-web/pages/login.html
frontend-web/pages/buyer-dashboard.html
frontend-web/pages/seller-dashboard.html
components/header.js
```

### 7.2 Fase 6.1B

Nuevas páginas o secciones:

```text
frontend-web/pages/seller-store-stats.html
frontend-web/pages/seller-earnings.html
frontend-web/pages/product-report.html opcional, o modal en product-detail.html
```

Secciones modificadas:

```text
frontend-web/pages/products.html
frontend-web/pages/product-detail.html
frontend-web/pages/seller-dashboard.html
frontend-web/js/ui/render-products.js
components/product-card.js
```

### 7.3 Fase 6.1C

Nuevas páginas:

```text
frontend-web/pages/chat.html
frontend-web/pages/conversation.html
frontend-web/pages/followers.html
frontend-web/pages/following.html
frontend-web/pages/admin-reports.html
frontend-web/pages/admin-search.html
frontend-web/pages/admin-users.html
```

Secciones modificadas:

```text
frontend-web/pages/admin-dashboard.html
frontend-web/pages/buyer-dashboard.html
frontend-web/pages/seller-dashboard.html
frontend-web/pages/product-detail.html
frontend-web/pages/public-profile.html
components/header.js
```

## 8. Riesgos técnicos

### 8.1 Riesgo de romper autenticación existente

Cambiar registro/login puede afectar todo el sistema. Mitigación:

- Hacer cambios compatibles hacia atrás cuando sea posible.
- Añadir valores por defecto para usuarios existentes.
- Probar login comprador, vendedor y administrador después de cada subfase.

### 8.2 Riesgo de datos históricos incompletos

Usuarios, productos y pedidos existentes no tendrán nuevos campos. Mitigación:

- Migraciones con defaults seguros.
- No usar columnas nuevas como obligatorias sin backfill.

### 8.3 Riesgo de privacidad y seguridad

Recuperación de contraseña y perfiles públicos pueden exponer información. Mitigación:

- Nunca guardar tokens planos.
- No exponer correo si el perfil es público, salvo decisión explícita.
- Logs sin contraseñas, tokens ni datos sensibles.

### 8.4 Riesgo en chat y reportes

Mensajes y reportes pueden contener contenido inapropiado. Mitigación MVP:

- Longitudes máximas.
- Sanitización básica.
- Moderación administrativa.

### 8.5 Riesgo de rendimiento

Dashboard admin y estadísticas pueden consultar muchas tablas. Mitigación:

- Consultas agregadas con índices.
- Paginación.
- Evitar cargar todo en frontend.

### 8.6 Riesgo de scope creep

Los nuevos requerimientos son amplios. Mitigación:

- Implementar por subfases.
- No mezclar chat/admin avanzado con recuperación de contraseña.
- Mantener MVP académico antes de mejorar detalles.

## 9. Orden recomendado de implementación

### Orden 1: Fase 6.1A

Razón: seguridad y estructura de usuario son base para todo lo demás.

Pasos recomendados:

1. Migración de usuarios, perfiles, términos y reset tokens.
2. Servicios de recuperación de contraseña.
3. Ajuste de registro/login.
4. Perfil propio y perfil público.
5. Ajustes de cuenta.
6. Upgrade comprador a vendedor.
7. Frontend de forgot/reset/profile/settings.
8. Pruebas de regresión de auth, catálogo, checkout.

### Orden 2: Fase 6.1B

Razón: amplía el modelo comercial sin depender todavía de chat.

Pasos recomendados:

1. Migración de productos ampliados y cuenta bancaria simulada.
2. Reportes de productos.
3. Estadísticas de tienda calculadas desde pedidos/comisiones.
4. Frontend de descuentos, reportes y estadísticas.
5. Pruebas de catálogo, detalle, seller dashboard y admin.

### Orden 3: Fase 6.1C

Razón: interacción social y admin avanzado dependen de perfiles y reportes.

Pasos recomendados:

1. Migración de seguimientos, conversaciones, mensajes y reportes de usuarios.
2. Endpoints de chat.
3. Endpoints de seguimiento.
4. Admin avanzado: reportes, búsqueda global, inactivación.
5. Notificaciones ampliadas.
6. Frontend chat, seguidores y admin avanzado.
7. Pruebas multiusuario.

## 10. Qué se puede hacer como MVP académico

### Seguridad y cuenta

- Recuperación de contraseña simulada en desarrollo, sin SMTP.
- Token/código temporal mostrado solo una vez en respuesta controlada y documentada.
- Aceptación de términos con versión fija `v1.0`.
- Inactivación lógica simple de cuenta.
- Upgrade comprador a vendedor con aceptación de condiciones.

### Perfiles

- Perfil público básico.
- Foto por URL, sin carga de archivos local todavía.
- Descripción personal.
- Seguidores/seguidos con contadores.

### Tienda y productos

- Descuento porcentual simple.
- Precio final calculado por backend.
- Fecha de caducidad opcional.
- Reporte de producto con motivo y descripción.
- Estadísticas calculadas en tiempo real desde tablas existentes.
- Cuenta bancaria simulada con datos ficticios.

### Chat

- Chat guardado en base de datos.
- Sin WebSockets.
- Actualización manual o por recarga.

### Administración

- Dashboard con métricas básicas.
- Gestión simple de reportes.
- Inactivar usuario.
- Ocultar producto.
- Búsqueda global básica.

## 11. Qué debe quedar como mejora futura

- SMTP real para recuperación de contraseña.
- Carga real de imágenes con storage seguro.
- Chat en tiempo real con WebSockets.
- Moderación automática de contenido.
- Sistema robusto de privacidad de perfil.
- Auditoría avanzada.
- Exportación de reportes.
- Dashboard con gráficas.
- Optimización avanzada de imágenes.
- Cache de consultas pesadas.
- Notificaciones push/correo.
- Pasarela de pagos real.
- Validación KYC o bancaria real.

## 12. Checklist de pruebas

### Regresión general obligatoria

- [ ] Login comprador funciona.
- [ ] Login vendedor funciona.
- [ ] Login administrador funciona.
- [ ] Registro comprador funciona.
- [ ] Registro vendedor funciona.
- [ ] Catálogo carga productos.
- [ ] Detalle de producto carga.
- [ ] Carrito valida con backend.
- [ ] Checkout crea pedido.
- [ ] Pago aprobado funciona.
- [ ] Pago rechazado funciona sin 500.
- [ ] Envíos se generan con pago aprobado.
- [ ] Reseñas siguen funcionando.

### Fase 6.1A

- [ ] Registro exige términos aceptados.
- [ ] Registro guarda versión y fecha de términos.
- [ ] Forgot password genera token/código temporal.
- [ ] Reset password cambia contraseña con token válido.
- [ ] Token vencido falla controladamente.
- [ ] Token usado no puede reutilizarse.
- [ ] Usuario inactivo no puede iniciar sesión.
- [ ] Usuario puede editar perfil.
- [ ] Perfil público no expone datos sensibles.
- [ ] Comprador puede solicitar upgrade a vendedor.
- [ ] Usuario puede inactivar cuenta sin borrar pedidos históricos.

### Fase 6.1B

- [ ] Producto con descuento muestra precio anterior y final.
- [ ] Descuento inválido devuelve 400.
- [ ] Producto vencido se maneja según regla definida.
- [ ] Comprador puede reportar producto.
- [ ] Admin ve reporte de producto.
- [ ] Vendedor ve estadísticas de tienda.
- [ ] Comisión 10% y ganancia 90% calculan correctamente.
- [ ] Cuenta bancaria simulada se guarda sin datos reales.
- [ ] Producto agotado aparece en estadísticas.

### Fase 6.1C

- [ ] Usuario puede seguir a otro usuario.
- [ ] Usuario puede dejar de seguir.
- [ ] Contadores de seguidores/seguidos actualizan.
- [ ] Comprador puede iniciar conversación con vendedor.
- [ ] Mensajes se guardan y listan.
- [ ] Usuario no puede leer conversación ajena.
- [ ] Usuario puede reportar a otro usuario.
- [ ] Admin puede gestionar reportes.
- [ ] Admin puede buscar usuarios/productos/tiendas.
- [ ] Admin puede inactivar usuario.
- [ ] Admin puede ocultar producto reportado.
- [ ] Notificaciones se pueden marcar como leídas.
- [ ] Notificaciones se pueden eliminar lógicamente.

## 13. Recomendación final

Implementar primero **Fase 6.1A** porque reduce riesgo y establece la base de identidad, permisos, perfil y cuenta. Después avanzar a **Fase 6.1B** para completar lógica comercial de tiendas/productos/ganancias. Finalmente implementar **Fase 6.1C**, que es la parte más amplia y con más riesgo funcional por chat, seguidores, reportes y administración avanzada.

No se recomienda implementar todo en una sola fase porque mezclar seguridad, comercio, chat y administración aumentaría el riesgo de romper checkout, pagos, envíos o roles ya existentes.
