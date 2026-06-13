# 09 - Plan de Implementación CommerCity

## 1. Estrategia general

La implementación debe ser incremental y segura. No conviene construir frontend completo antes de tener backend, autenticación, roles y base de datos funcionando. El proyecto debe avanzar por fases, validando cada bloque antes de pasar al siguiente.

## 2. Fase 1 - Estructura del repositorio y configuración base

### Objetivo

Crear la base del proyecto sin desarrollar módulos finales.

### Entregables

- Estructura principal de carpetas.
- `.gitignore`.
- README principal.
- Backend Express mínimo.
- `.env.example`.
- Configuración inicial de conexión MySQL.
- Estructura para migraciones y seeders.
- Estructura web.
- Estructura Expo.

### Validación

- Backend inicia localmente.
- Endpoint health check responde.
- Variables requeridas documentadas.

## 3. Fase 2 - Backend, base de datos, autenticación y roles

### Objetivo

Construir la seguridad base del sistema.

### Entregables

- Tablas `roles` y `usuarios`.
- Seed de roles.
- Seed de administrador.
- Registro comprador/vendedor.
- Login.
- JWT.
- bcrypt.
- Middleware `authRequired`.
- Middleware por rol.
- Endpoint `/auth/me`.

### Validación

- Comprador se registra.
- Vendedor se registra.
- Administrador no se registra públicamente.
- Login devuelve token.
- Ruta protegida sin token devuelve 401.
- Ruta con rol incorrecto devuelve 403.

## 4. Fase 3 - Tiendas, productos, categorías e inventario

### Objetivo

Permitir operación básica del vendedor y catálogo público.

### Entregables

- Tabla `tiendas`.
- Tabla `categorias`.
- Tabla `productos`.
- CRUD tienda propia.
- CRUD categorías por administrador.
- CRUD productos por vendedor.
- Catálogo público.
- Búsqueda y filtros.
- Validación de propiedad.

### Validación

- Vendedor crea una sola tienda.
- Vendedor no edita tienda ajena.
- Vendedor crea producto propio.
- Vendedor no edita producto ajeno.
- Comprador ve solo productos activos.

## 5. Fase 4 - Carrito, pedidos y pagos sandbox

### Objetivo

Construir el flujo comercial principal.

### Entregables

- Validación backend de carrito.
- Tabla `direcciones`.
- Tabla `pedidos`.
- Tabla `pedido_detalles`.
- Tabla `pagos`.
- Tabla `comisiones`.
- Creación de pedido pendiente.
- Pago sandbox.
- Webhook simulado.
- Descuento de stock.
- Cálculo de comisiones.

### Validación

- Carrito con productos válidos pasa validación.
- Carrito con stock insuficiente falla.
- Pedido conserva precio histórico.
- Pago aprobado descuenta stock.
- Pago rechazado no descuenta stock.
- Pedido multi-tienda genera comisiones separadas.

## 6. Fase 5 - Envíos, reseñas, reputación y reportes

### Objetivo

Completar flujo postventa y confianza.

### Entregables

- Tabla `envios`.
- Tabla `resenas`.
- Tabla `notificaciones`.
- Tabla `logs_acciones`.
- Generación de envío por tienda.
- Despacho por vendedor.
- Rastreo por comprador.
- Reseñas verificadas.
- Reputación de producto y tienda.
- Reportes básicos.

### Validación

- Pedido con dos tiendas genera dos envíos.
- Vendedor solo actualiza envíos de su tienda.
- Comprador solo reseña productos pagados y entregados.
- Promedio y reputación se recalculan.

## 7. Fase 6 - Frontend web responsive

### Objetivo

Construir la interfaz web completa consumiendo la API.

### Entregables

- Home.
- Login.
- Registro.
- Catálogo.
- Detalle de producto.
- Carrito.
- Checkout.
- Panel comprador.
- Panel vendedor.
- Panel administrador.
- Componentes visuales reutilizables.

### Validación

- Web consume API real.
- Diseño respeta guía visual.
- Rutas privadas respetan JWT y roles.
- Carrito persiste en LocalStorage.
- Checkout usa validación backend.

## 8. Fase 7 - Aplicación móvil con Expo

### Objetivo

Construir MVP móvil usando la misma API.

### Entregables

- Proyecto Expo.
- Navegación pública y privada.
- Login.
- Registro.
- Catálogo.
- Detalle producto.
- Carrito.
- Checkout.
- Mis pedidos.
- Mis envíos.
- Reseñas.

### Validación

- App corre con Expo.
- Login guarda token en AsyncStorage.
- Catálogo carga desde API.
- Carrito persiste.
- Checkout valida carrito antes de pagar.

## 9. Fase 8 - Pruebas, documentación y despliegue en Oracle Cloud

### Objetivo

Preparar entrega académica y ambiente servidor.

### Entregables

- Pruebas unitarias básicas.
- Pruebas de endpoints críticos.
- Pruebas manuales por rol.
- README técnico.
- Manual de usuario básico.
- Configuración PM2.
- Configuración Nginx.
- Guía de despliegue Oracle Cloud Ubuntu 24.04.

### Validación

- Backend responde en servidor.
- PM2 mantiene proceso activo.
- Nginx enruta a backend.
- MySQL funciona en servidor.
- Variables reales están fuera del repositorio.

## 10. Primer módulo a implementar

Después de aprobar esta planeación, el primer módulo técnico debe ser:

**Fase 1 + inicio de Fase 2: estructura del repositorio, backend Express base, conexión MySQL, roles, usuarios, JWT y bcrypt.**

## 11. Reglas de seguridad durante implementación

- No borrar documentos originales.
- No sobrescribir archivos sin revisar contenido.
- No exponer credenciales.
- No crear JWT secrets reales en el código.
- Usar `.env.example` para variables.
- Confirmar antes de ejecutar acciones destructivas.
- Mantener commits pequeños si se usa Git.
- Probar cada módulo antes de avanzar.

## 12. Orden recomendado de trabajo diario

1. Revisar objetivo del día.
2. Crear o ajustar pruebas mínimas.
3. Implementar módulo pequeño.
4. Probar endpoint o interfaz.
5. Documentar avance.
6. Revisar seguridad y permisos.
7. Preparar siguiente paso.

## 13. Riesgos y mitigación

### Alcance demasiado amplio

Mitigación: priorizar MVP y fases.

### Errores de autorización

Mitigación: probar cada ruta con comprador, vendedor y administrador.

### Inconsistencias de inventario

Mitigación: transacciones en pago y stock.

### Dificultad móvil

Mitigación: API estable primero, móvil después.

### Despliegue cloud complejo

Mitigación: validar localmente antes de Oracle Cloud.

## 14. Definición de terminado general

Una fase se considera terminada cuando:

- Funcionalidad principal opera.
- Casos de error están controlados.
- Roles están protegidos.
- Datos sensibles no se exponen.
- Hay validación manual o automatizada.
- La documentación mínima está actualizada.
