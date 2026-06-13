# 05 - Plan Frontend Web CommerCity

## 1. Stack definido

- HTML.
- Tailwind CSS.
- JavaScript.
- Consumo de API REST mediante `fetch`.
- Almacenamiento local para JWT y carrito.

## 2. Objetivo visual

La web debe ser moderna, limpia, confiable, rápida y fácil de usar. Debe transmitir:

- Confianza.
- Tecnología.
- Orden.
- Seguridad.
- Facilidad de compra.
- Profesionalismo.

## 3. Estructura recomendada

```text
frontend-web/
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   ├── product-detail.html
│   ├── cart.html
│   ├── checkout.html
│   ├── buyer-dashboard.html
│   ├── seller-dashboard.html
│   └── admin-dashboard.html
├── components/
│   ├── header.html
│   ├── footer.html
│   ├── product-card.html
│   ├── empty-state.html
│   └── modal.html
├── js/
│   ├── api/
│   │   ├── client.js
│   │   ├── auth.api.js
│   │   ├── products.api.js
│   │   ├── stores.api.js
│   │   └── orders.api.js
│   ├── auth/
│   │   ├── session.js
│   │   └── guards.js
│   ├── cart/
│   │   └── cart.storage.js
│   ├── ui/
│   │   ├── render-products.js
│   │   ├── alerts.js
│   │   └── loaders.js
│   └── main.js
├── css/
│   └── input.css
└── assets/
    └── logo/
```

## 4. Páginas públicas

### Inicio

Debe incluir:

- Header con logo.
- Barra de búsqueda visible.
- Categorías destacadas.
- Productos destacados.
- Beneficios: compra segura, múltiples tiendas, pagos sandbox, envíos por tienda.
- CTA hacia registro o catálogo.

### Catálogo

Debe incluir:

- Grid responsive de productos.
- Filtros por categoría.
- Filtro por tienda.
- Orden por precio y calificación.
- Paginación.
- Estado vacío.
- Loader.

### Detalle de producto

Debe incluir:

- Imagen principal.
- Nombre.
- Precio.
- Tienda.
- Stock.
- Descripción.
- Botón agregar al carrito.
- Reseñas aprobadas.
- Productos relacionados básicos.

## 5. Autenticación web

### Login

- Correo.
- Contraseña.
- Mensajes claros.
- Guardar JWT si login es exitoso.
- Redirigir según rol.

### Registro

- Nombre.
- Correo.
- Contraseña.
- Confirmación de contraseña.
- Rol: comprador o vendedor.
- No mostrar administrador como opción.

## 6. Carrito

El carrito web debe guardarse en LocalStorage.

Debe mostrar:

- Productos agrupados o identificados por tienda.
- Cantidad editable.
- Subtotal por producto.
- Total general.
- Botón validar y continuar.

Antes de pagar:

- Enviar carrito a `/cart/validate`.
- Mostrar cambios de precio o stock.
- Bloquear checkout si hay productos inválidos.

## 7. Checkout

Flujo recomendado:

1. Datos del cliente.
2. Dirección de envío.
3. Método de pago sandbox.
4. Confirmación del pedido.

No se deben guardar tarjetas reales.

## 8. Panel comprador

Debe incluir:

- Perfil básico.
- Mis pedidos.
- Estado general de pedidos.
- Envíos por paquete.
- Direcciones.
- Reseñas pendientes o realizadas.

## 9. Panel vendedor

Debe incluir:

- Estado de tienda.
- Onboarding si no tiene tienda.
- Productos propios.
- Crear/editar producto.
- Pedidos de su tienda.
- Envíos pendientes.
- Reporte básico de ventas.
- Productos agotados.

## 10. Panel administrador

Debe incluir:

- Usuarios.
- Vendedores.
- Compradores.
- Tiendas.
- Categorías.
- Productos.
- Pedidos.
- Pagos.
- Reportes.
- Logs.

## 11. Guardas de navegación

- Si no hay JWT, bloquear páginas privadas.
- Si el rol no coincide, redirigir o mostrar 403 visual.
- Si token expiró, cerrar sesión y enviar a login.

## 12. Componentes reutilizables

- Header.
- Footer.
- ProductCard.
- StoreCard.
- Button.
- Alert.
- Modal.
- EmptyState.
- Loader.
- Badge de estado.
- Tabla responsive.

## 13. Diseño responsive

Breakpoints recomendados:

- Móvil: 1 columna.
- Tablet: 2 columnas.
- Escritorio: 3 a 4 columnas.
- Pantallas grandes: máximo ancho centralizado.

## 14. Criterios de aceptación web

- El catálogo carga paginado.
- El carrito persiste al recargar.
- El login redirige según rol.
- Comprador no puede entrar al panel vendedor.
- Vendedor no puede entrar al panel administrador.
- La interfaz mantiene colores y tipografías de la guía.
- Las acciones críticas muestran confirmación o error claro.
