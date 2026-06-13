# CommerCity

CommerCity es un marketplace web y móvil multi-tienda desarrollado como proyecto formativo SENA ADSO.

## Estado actual

Fase 1: estructura del repositorio y configuración base.

En esta fase se prepara la base técnica sin desarrollar todavía módulos finales como autenticación completa, tiendas, productos, pedidos, pagos, envíos o reseñas.

## Estructura principal

```text
commercity/
├── docs/
├── assets/
├── planning/
├── backend/
├── frontend-web/
├── mobile-app/
└── deployment/
```

## Stack definido

- Backend: Node.js + Express.
- Base de datos: MySQL.
- Web: HTML + Tailwind CSS + JavaScript.
- Móvil: React Native + Expo.
- Infraestructura objetivo: Oracle Cloud Ubuntu 24.04, PM2 y Nginx.

## Seguridad

- No subir archivos `.env` reales.
- Usar `.env.example` como plantilla pública.
- No guardar credenciales reales en código fuente.
