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
