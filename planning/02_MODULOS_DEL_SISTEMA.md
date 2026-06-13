# 02 - Módulos del Sistema CommerCity

## 1. Módulo de autenticación, usuarios y permisos RBAC

### Objetivo

Controlar registro, inicio de sesión, roles, permisos y acceso seguro a rutas privadas.

### Funciones principales

- Registro de comprador o vendedor.
- Bloqueo de registro público como administrador.
- Creación de administrador por seed.
- Login con correo y contraseña.
- Hash de contraseñas con bcrypt.
- Generación de JWT.
- Consulta de perfil autenticado.
- Control de acceso por roles.
- Respuestas 401 y 403 según corresponda.

### Reglas críticas

- Nunca guardar contraseñas en texto plano.
- JWT solo debe contener datos mínimos: id, correo y rol.
- No revelar si falló correo o contraseña en login.

## 2. Módulo de vendedores y tiendas

### Objetivo

Permitir que cada vendedor cree y administre una única tienda.

### Funciones principales

- Onboarding obligatorio de vendedor.
- Crear tienda con nombre único.
- Editar descripción, logo y banner.
- Pausar/reactivar tienda.
- Perfil público de tienda.
- Listado de productos por tienda.

### Reglas críticas

- Un vendedor no puede tener más de una tienda.
- Un vendedor no puede editar tiendas ajenas.
- Una tienda pausada no debe aparecer en búsquedas generales.

## 3. Módulo de catálogo e inventario multi-tienda

### Objetivo

Gestionar productos, stock, visibilidad y propiedad por tienda.

### Funciones principales

- Crear productos asociados a tienda.
- Editar productos propios.
- Ocultar o eliminar productos.
- Controlar precio, stock, imagen y categoría.
- Mostrar solo productos activos al comprador.
- Marcar producto como agotado cuando stock llegue a cero.

### Reglas críticas

- Precio mayor que cero.
- Stock nunca negativo.
- Descuento de inventario solo después de pago aprobado.
- Validar propiedad antes de editar/eliminar.

## 4. Módulo de categorías, búsqueda y filtros

### Objetivo

Organizar el catálogo global y facilitar búsqueda de productos.

### Funciones principales

- Crear categorías globales.
- Editar categorías.
- Eliminar solo categorías sin productos activos.
- Filtrar por categoría.
- Buscar por nombre de producto.
- Buscar por tienda.
- Ordenar por precio y calificación.
- Paginación de catálogo.

### Reglas críticas

- Solo administrador puede modificar categorías.
- No eliminar categorías asociadas a productos activos.

## 5. Módulo de carrito multi-vendedor

### Objetivo

Permitir que el comprador agrupe productos de varias tiendas en una sola experiencia de compra.

### Funciones principales

- Agregar productos al carrito.
- Modificar cantidades.
- Eliminar productos.
- Calcular subtotales.
- Calcular total general.
- Persistir carrito en LocalStorage o AsyncStorage.
- Validar precio y stock antes del pago.

### Reglas críticas

- El carrito local no es fuente de verdad.
- Backend debe validar productos antes de crear pedido.
- Notificar cambios de precio, agotados o productos desactivados.

## 6. Módulo de pedidos, facturación y distribución financiera

### Objetivo

Crear órdenes maestras, detalles por producto y distribución financiera simulada.

### Funciones principales

- Crear pedido pendiente.
- Registrar comprador, dirección y total.
- Crear detalle por producto.
- Guardar precio histórico.
- Calcular comisión de plataforma.
- Calcular valor neto del vendedor.
- Consultar historial de pedidos.
- Consultar pedidos por tienda.
- Consultar pedidos globales por administrador.

### Reglas críticas

- Usar transacciones.
- El precio histórico no cambia aunque el producto cambie después.
- La orden puede contener productos de varias tiendas.

## 7. Módulo de pagos sandbox

### Objetivo

Simular una pasarela de pagos para validar el flujo comercial sin dinero real.

### Funciones principales

- Recibir datos de tarjeta de prueba.
- Simular autorización.
- Aprobar o rechazar por reglas sandbox.
- Registrar intentos de pago.
- Actualizar estado de pedido.
- Ejecutar webhook simulado.
- Generar comprobante simulado.

### Reglas críticas

- Nunca guardar datos reales de tarjeta.
- No descontar inventario si el pago falla.
- No generar envíos si el pago es rechazado.

## 8. Módulo de envíos y logística independiente

### Objetivo

Gestionar envíos por tienda cuando un pedido contiene productos de múltiples vendedores.

### Funciones principales

- Registrar direcciones de envío.
- Seleccionar dirección antes de pagar.
- Crear envío por tienda involucrada.
- Vendedor registra transportadora.
- Vendedor registra número de guía simulado.
- Cambiar estados: pendiente, preparado, en camino, entregado.
- Comprador rastrea cada paquete.

### Reglas críticas

- Un pedido multi-tienda genera múltiples envíos.
- Un vendedor solo ve envíos de su tienda.

## 9. Módulo de reseñas y reputación

### Objetivo

Permitir calificaciones verificadas y construir confianza en productos y tiendas.

### Funciones principales

- Calificar productos comprados.
- Registrar estrellas de 1 a 5.
- Registrar comentario.
- Validar compra pagada y entregada.
- Calcular promedio de producto.
- Calcular reputación de tienda.
- Moderar reseñas por administrador.

### Reglas críticas

- No permitir reseñas sin compra verificada.
- No permitir reseñar productos propios.
- Reputación puede clasificarse como Platino, Oro o Regular.

## 10. Módulo de administración general

### Objetivo

Permitir control central del marketplace.

### Funciones principales

- Consultar usuarios.
- Activar/desactivar usuarios.
- Consultar vendedores y compradores.
- Gestionar tiendas.
- Pausar/reactivar tiendas.
- Ocultar productos.
- Moderar reseñas.
- Consultar ventas simuladas.
- Consultar comisiones.
- Consultar saldos por vendedor.
- Generar reportes básicos.
- Consultar logs importantes.

## 11. Módulo de notificaciones básicas

### Objetivo

Informar eventos importantes del sistema.

### Eventos recomendados

- Pago aprobado o rechazado.
- Nueva venta para vendedor.
- Cambio de estado de paquete.
- Producto sin stock.

Para primera versión pueden ser notificaciones dentro de la interfaz, no necesariamente correo o push.
