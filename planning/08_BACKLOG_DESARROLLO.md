# 08 - Backlog de Desarrollo CommerCity

## 1. Criterios de priorización

Priorizar por dependencia técnica y riesgo:

1. Estructura base.
2. Seguridad y roles.
3. Base de datos.
4. Tiendas y productos.
5. Carrito y pedido.
6. Pago sandbox e inventario.
7. Envíos y reseñas.
8. Interfaces web y móvil.
9. Reportes, documentación y despliegue.

## 2. Épica 1 - Estructura del repositorio

### Historias

- Como equipo, quiero una estructura de carpetas clara para separar backend, web, móvil, documentación y despliegue.
- Como desarrollador, quiero archivos `.env.example` para conocer variables necesarias sin exponer secretos.
- Como líder técnico, quiero README inicial por subproyecto para facilitar instalación y ejecución.

### Entregables

- `backend/`
- `frontend-web/`
- `mobile-app/`
- `deployment/`
- `.gitignore`
- README principal.

## 3. Épica 2 - Autenticación y roles

### Historias

- Como visitante, quiero registrarme como comprador o vendedor.
- Como usuario, quiero iniciar sesión con correo y contraseña.
- Como sistema, quiero cifrar contraseñas con bcrypt.
- Como sistema, quiero generar JWT para usuarios autenticados.
- Como administrador, quiero ser creado por seed, no por registro público.
- Como sistema, quiero bloquear rutas privadas sin token.
- Como sistema, quiero bloquear rutas según rol.

### Criterios de aceptación

- Registro administrador público rechazado.
- Login devuelve JWT.
- Token expirado genera cierre de sesión.
- Ruta privada sin token devuelve 401.
- Rol incorrecto devuelve 403.

## 4. Épica 3 - Tiendas

### Historias

- Como vendedor, quiero crear una tienda para publicar productos.
- Como vendedor, quiero editar la información pública de mi tienda.
- Como vendedor, quiero pausar temporalmente mi tienda.
- Como comprador, quiero ver el perfil público de una tienda.
- Como sistema, quiero impedir que un vendedor cree más de una tienda.

### Criterios de aceptación

- Nombre de tienda único.
- Vendedor sin tienda no puede publicar productos.
- Tienda pausada oculta productos del buscador general.

## 5. Épica 4 - Categorías y productos

### Historias

- Como administrador, quiero crear categorías globales.
- Como vendedor, quiero crear productos asociados a mi tienda.
- Como vendedor, quiero editar productos propios.
- Como vendedor, quiero ocultar productos propios.
- Como comprador, quiero buscar productos por nombre, categoría y tienda.
- Como comprador, quiero ordenar productos por precio o calificación.

### Criterios de aceptación

- Precio mayor a cero.
- Stock no negativo.
- Vendedor no edita productos ajenos.
- Comprador solo ve productos activos de tiendas activas.

## 6. Épica 5 - Carrito

### Historias

- Como comprador, quiero agregar productos de diferentes tiendas al carrito.
- Como comprador, quiero modificar cantidades.
- Como comprador, quiero eliminar productos.
- Como comprador, quiero conservar el carrito al recargar.
- Como sistema, quiero validar precios y stock antes del pago.

### Criterios de aceptación

- Carrito persiste localmente.
- Validación detecta productos agotados.
- Validación detecta cambio de precio.
- Validación impide comprar más stock del disponible.

## 7. Épica 6 - Pedidos y pagos sandbox

### Historias

- Como comprador, quiero crear un pedido desde mi carrito validado.
- Como sistema, quiero guardar detalle de productos con precio histórico.
- Como sistema, quiero calcular comisiones simuladas.
- Como comprador, quiero pagar con tarjeta de prueba.
- Como sistema, quiero aprobar o rechazar pagos por reglas sandbox.
- Como sistema, quiero descontar stock solo si el pago es aprobado.

### Criterios de aceptación

- Pedido pendiente se crea correctamente.
- Pago aprobado cambia estado a pagado.
- Pago rechazado no descuenta stock.
- Pedido multi-tienda genera distribución por tienda.

## 8. Épica 7 - Envíos

### Historias

- Como comprador, quiero registrar direcciones de envío.
- Como sistema, quiero generar un envío por tienda involucrada.
- Como vendedor, quiero registrar transportadora y guía.
- Como comprador, quiero rastrear cada paquete por separado.

### Criterios de aceptación

- Pedido con dos tiendas genera dos envíos.
- Vendedor solo ve envíos de su tienda.
- Estados cambian de pendiente a preparado, en camino y entregado.

## 9. Épica 8 - Reseñas y reputación

### Historias

- Como comprador, quiero calificar productos comprados y entregados.
- Como sistema, quiero impedir reseñas sin compra verificada.
- Como sistema, quiero recalcular promedio del producto.
- Como sistema, quiero recalcular reputación de tienda.
- Como administrador, quiero moderar reseñas.

### Criterios de aceptación

- Usuario sin compra no puede reseñar.
- Compra no entregada no permite reseña.
- Promedio de producto se actualiza.
- Reputación de tienda se actualiza.

## 10. Épica 9 - Frontend web

### Historias

- Como comprador, quiero una home clara con catálogo y búsqueda.
- Como comprador, quiero usar carrito y checkout desde web.
- Como vendedor, quiero gestionar mi tienda y productos desde web.
- Como administrador, quiero gestionar usuarios, categorías, tiendas y reportes.

### Criterios de aceptación

- Web responsive.
- Diseño respeta guía visual.
- Rutas protegidas por rol.
- Consumo real de API.

## 11. Épica 10 - App móvil Expo

### Historias

- Como comprador, quiero navegar productos desde Android.
- Como comprador, quiero comprar y rastrear pedidos desde móvil.
- Como comprador, quiero calificar productos desde móvil.
- Como vendedor, quiero consultar pedidos básicos desde móvil.

### Criterios de aceptación

- App corre en Expo.
- Login y token funcionan.
- Catálogo consume API.
- Carrito persiste con AsyncStorage.

## 12. Épica 11 - Pruebas y despliegue

### Historias

- Como desarrollador, quiero pruebas de autenticación, productos, carrito, pagos y pedidos.
- Como equipo, quiero desplegar backend en Oracle Cloud.
- Como equipo, quiero usar PM2 para mantener proceso activo.
- Como equipo, quiero usar Nginx como reverse proxy.
- Como instructor, quiero documentación clara de instalación y uso.

### Criterios de aceptación

- Pruebas críticas pasan.
- Backend responde en servidor.
- PM2 mantiene proceso vivo.
- Nginx enruta correctamente.
- README permite reproducir instalación.

## 13. Backlog técnico inicial ordenado

1. Crear estructura de repo.
2. Crear backend Express base.
3. Configurar conexión MySQL.
4. Crear migraciones de roles y usuarios.
5. Crear seed de administrador.
6. Implementar registro y login.
7. Implementar middlewares JWT y RBAC.
8. Crear tiendas.
9. Crear categorías.
10. Crear productos.
11. Crear catálogo público.
12. Crear validación de carrito.
13. Crear pedidos.
14. Crear pagos sandbox.
15. Crear envíos.
16. Crear reseñas.
17. Crear reportes.
18. Crear web pública.
19. Crear panel comprador.
20. Crear panel vendedor.
21. Crear panel administrador.
22. Crear app móvil MVP.
23. Crear pruebas.
24. Preparar despliegue.
25. Crear documentación final.
