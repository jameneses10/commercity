# 01 - Arquitectura Técnica CommerCity

## 1. Visión arquitectónica

CommerCity debe construirse como una solución modular con una API REST central consumida por dos clientes:

- Cliente web responsive en HTML, Tailwind CSS y JavaScript.
- Aplicación móvil en React Native + Expo.

Ambos clientes consumen el mismo backend Node.js + Express, que centraliza autenticación, autorización, reglas de negocio, validaciones y acceso a MySQL.

## 2. Diagrama textual de arquitectura

```text
[Cliente Web HTML + Tailwind + JS]
                 │
                 ├── HTTPS / JSON REST
                 │
[App Móvil React Native + Expo]
                 │
                 ▼
        [Nginx Reverse Proxy]
                 │
                 ▼
       [API Node.js + Express]
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 [Middlewares] [Servicios] [Validadores]
 JWT + RBAC    Negocio     Entrada/salida
      │          │
      ▼          ▼
        [MySQL Database]
                 │
                 ▼
       [Logs / Seeds / Migraciones]
```

## 3. Capas recomendadas del backend

### Capa de entrada

- Rutas Express.
- Validación básica de parámetros.
- Middlewares de autenticación y autorización.
- Manejo de errores HTTP.

### Capa de controladores

- Recibe petición y respuesta.
- No debe contener lógica compleja.
- Llama servicios especializados.

### Capa de servicios

- Contiene reglas de negocio.
- Valida propiedad de recursos.
- Calcula totales, comisiones, reputación y estados.
- Coordina transacciones críticas.

### Capa de modelos/repositorios

- Acceso a MySQL.
- Consultas parametrizadas.
- Operaciones CRUD.
- Transacciones.

### Capa de utilidades

- JWT.
- bcrypt.
- respuestas estándar.
- paginación.
- validaciones reutilizables.
- cálculo de comisiones.

## 4. Estructura de carpetas recomendada

```text
commercity/
├── docs/
├── assets/
├── planning/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── schema.sql
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend-web/
│   ├── index.html
│   ├── pages/
│   ├── components/
│   ├── assets/
│   ├── js/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   └── ui/
│   ├── css/
│   └── README.md
├── mobile-app/
│   ├── App.js
│   ├── app.json
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── storage/
│   │   └── theme/
│   └── README.md
└── deployment/
    ├── nginx/
    ├── pm2/
    └── oracle-cloud/
```

## 5. Backend

### Stack

- Node.js.
- Express.
- MySQL.
- JWT.
- bcrypt.
- dotenv.
- cors.
- helmet.
- morgan o logger equivalente.

### Reglas clave

- Usar `.env` para credenciales reales.
- Publicar solo `.env.example`.
- Todas las rutas privadas deben exigir el encabezado `Authorization: Bearer JWT_TOKEN`.
- Separar rutas por módulo.
- No mezclar SQL directo en controladores.
- Usar transacciones en pago, pedido, inventario y envíos.

## 6. Base de datos

Motor definido: MySQL.

Características:

- Modelo relacional normalizado.
- Índices para campos de búsqueda frecuentes.
- Llaves foráneas para integridad.
- Estados controlados mediante ENUM o catálogos simples.
- Campos `created_at` y `updated_at` en entidades principales.

## 7. Seguridad

### Autenticación

- Registro público solo para comprador y vendedor.
- Administrador creado por seed.
- Contraseñas con bcrypt.
- Login con JWT.
- JWT con id, correo y rol.
- Expiración configurada por variable de entorno.

### Autorización

Middlewares mínimos:

- `authRequired`.
- `requireRole('administrador')`.
- `requireRole('vendedor')`.
- `requireRole('comprador')`.
- `validateStoreOwner`.
- `validateProductOwner`.
- `validateVerifiedPurchase`.

## 8. Web

La web debe ser responsive, rápida y clara. Debe priorizar:

- Catálogo visible.
- Búsqueda central.
- Tarjetas limpias.
- Carrito fácil de usar.
- Paneles separados por rol.
- Consumo de API mediante servicios JavaScript.

## 9. Móvil

La app móvil con Expo debe cubrir primero los flujos de comprador y luego funciones esenciales de vendedor:

- Login/registro.
- Catálogo.
- Detalle producto.
- Carrito.
- Checkout sandbox.
- Mis pedidos.
- Rastreo de envíos.
- Reseñas.
- Panel vendedor básico.

## 10. Infraestructura Oracle Cloud

Ambiente objetivo:

- Ubuntu 24.04.
- Node.js LTS.
- MySQL.
- PM2 para proceso backend.
- Nginx como reverse proxy.
- Firewall restringiendo puertos.
- HTTPS recomendado con Certbot cuando exista dominio.

## 11. Riesgos técnicos

- Alcance amplio para proyecto académico.
- Inconsistencias de stock si no se usan transacciones.
- Fallos de autorización si no se prueban roles cruzados.
- Duplicidad de lógica entre web y móvil.
- Complejidad de pedidos multi-tienda.

## 12. Recomendación de arquitectura

Construir de forma incremental:

1. Base del repositorio.
2. Backend estable con auth y roles.
3. Base de datos validada.
4. Módulos transaccionales.
5. Web.
6. Móvil.
7. Despliegue.

No iniciar interfaz completa antes de tener API y modelo de datos mínimos funcionando.
