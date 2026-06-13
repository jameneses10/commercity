# 00 - Resumen del Proyecto CommerCity

## 1. Contexto general

CommerCity es un proyecto formativo SENA ADSO orientado a construir un marketplace web y móvil multi-tienda. Su objetivo es conectar compradores, vendedores y administradores en una plataforma centralizada, segura y organizada.

La solución se concibe como una ciudad comercial digital donde diferentes vendedores pueden crear su tienda, publicar productos y vender dentro de un ecosistema común. Los compradores podrán navegar productos, usar carrito multi-vendedor, realizar pagos simulados, rastrear envíos y dejar reseñas verificadas.

## 2. Documentos revisados

Se revisaron los documentos base ubicados en `docs/`:

- `Documentación CommerCity SENA ADSO35.doc`
- `Guía de Diseño.docx`
- `Requisitos Específicos Del Sistema Commercity.docx`

También se revisó el logo oficial:

- `assets/Logo - Commercity.png`

Nota: el requerimiento menciona `assets/logo/Logo - Commercity.png`, pero en el workspace actual el archivo encontrado está en `assets/Logo - Commercity.png`.

## 3. Problema que resuelve

Muchos pequeños comercios y emprendedores no tienen una plataforma digital propia para vender productos, gestionar inventario, pedidos, pagos, envíos y reputación. CommerCity responde a esa necesidad con una plataforma multi-vendedor donde cada tienda mantiene independencia operativa, pero todos los usuarios compran desde una experiencia centralizada.

## 4. Objetivo principal

Diseñar e implementar un marketplace web y móvil con arquitectura multi-tienda que permita:

- Registro e inicio de sesión seguro.
- Roles de comprador, vendedor y administrador.
- Gestión de tiendas independientes.
- Catálogo de productos por tienda.
- Carrito multi-vendedor.
- Pedidos con detalle transaccional.
- Pagos simulados sandbox.
- Envíos por tienda.
- Reseñas verificadas.
- Reputación de productos y tiendas.
- Administración general del sistema.

## 5. Roles del sistema

### Comprador

Usuario que navega el catálogo, agrega productos al carrito, compra, registra direcciones, rastrea envíos y califica productos comprados.

### Vendedor

Usuario que administra una única tienda dentro del marketplace. Puede crear productos, gestionar inventario, revisar pedidos asociados a su tienda y actualizar estados de envío.

### Administrador

Usuario general creado por semilla de base de datos. No se registra desde la interfaz pública. Puede gestionar categorías, usuarios, tiendas, productos, reportes, comisiones y moderación.

## 6. Alcance incluido

- Registro de compradores y vendedores.
- Administrador creado mediante seed.
- Autenticación JWT.
- Contraseñas cifradas con bcrypt.
- RBAC por roles.
- Gestión de tienda única por vendedor.
- CRUD de productos por tienda.
- Categorías globales administradas por administrador.
- Catálogo público con búsqueda, filtros y paginación.
- Carrito multi-vendedor en almacenamiento local.
- Validación de stock y precios antes del pago.
- Orden maestra y detalle por producto.
- Pagos sandbox con aprobación/rechazo simulado.
- Descuento de stock solo si el pago es aprobado.
- Envíos independientes por tienda.
- Reseñas solo para compras pagadas y entregadas.
- Reportes básicos por vendedor y administrador.
- Logs básicos de acciones importantes.

## 7. Alcance no incluido en la primera versión

- Pasarela bancaria real.
- Facturación electrónica oficial.
- Integración real con transportadoras externas.
- Chat en tiempo real.
- Recomendaciones con inteligencia artificial.
- Panel financiero real con retiros o conciliación bancaria.

## 8. Tecnologías base definidas

- Backend: Node.js + Express.
- Base de datos: MySQL.
- Autenticación: JWT.
- Hash de contraseñas: bcrypt.
- Web: HTML + Tailwind CSS + JavaScript.
- Móvil: React Native + Expo.
- Infraestructura: Oracle Cloud Ubuntu 24.04.
- Procesos: PM2.
- Proxy/servidor: Nginx.
- Variables sensibles: `.env`, con plantilla pública `.env.example`.

## 9. Principios técnicos

- Seguridad desde el diseño.
- Arquitectura modular.
- API REST común para web y móvil.
- Base de datos relacional normalizada.
- Validación en backend aunque exista validación frontend.
- Separación de responsabilidades por rutas, controladores, servicios, modelos y middlewares.
- Transacciones en procesos críticos: pedidos, pagos, stock y envíos.
- No exponer `password_hash` ni información sensible en respuestas API.
- No crear secretos reales dentro del código.

## 10. Primer módulo recomendado

El primer módulo a implementar después de esta planeación debe ser:

**Módulo de estructura base + autenticación + roles.**

Justificación:

- Todo el sistema depende de usuarios, roles y permisos.
- Las tiendas, productos, pedidos, envíos y reseñas requieren saber quién ejecuta la acción.
- Permite definir desde el inicio JWT, bcrypt, middlewares RBAC y administrador por seed.
- Reduce riesgos de seguridad antes de construir módulos transaccionales.
