# 07 - UI/UX Design System CommerCity

## 1. Identidad visual

CommerCity debe comunicar una experiencia moderna, comercial, tecnológica, limpia y minimalista. La interfaz no debe verse recargada; debe priorizar productos visibles, navegación clara, acciones evidentes y buen contraste.

## 2. Logo oficial

Archivo revisado:

- `assets/Logo - Commercity.png`

Observaciones visuales:

- El logo usa un carrito de compras como símbolo principal.
- Dentro/sobre el carrito aparecen formas de edificios, reforzando la idea de “ciudad comercial”.
- La palabra `Commercity` está en tipografía gruesa, redondeada y moderna.
- El color naranja aparece en la parte comercial/acción del carrito y en `Commer`.
- El color azul aparece en la cesta, edificios y `city`.
- El fondo del archivo es blanco.

Recomendación:

- Usar el logo completo en login, home y footer.
- Usar solo isotipo/carrito si en el futuro se crea versión reducida.
- Respetar espacio alrededor del logo.
- No deformar ni cambiar colores del logo.

## 3. Paleta principal

Según la guía de diseño:

- Azul CommerCity: `#2563EB`.
- Azul confianza: `#1E40AF`.
- Azul muy oscuro: `#0F172A`.
- Naranja acción: `#F97316`.
- Naranja oscuro hover: `#EA580C`.
- Fondo general: `#F8FAFC`.
- Tarjetas: `#FFFFFF`.
- Texto principal: `#111827`.
- Texto secundario: `#6B7280`.
- Bordes: `#E5E7EB`.
- Éxito: `#22C55E`.
- Error: `#EF4444`.
- Advertencia: `#F59E0B`.

## 4. Uso de color

### Azul

Usar en:

- Header.
- Botones principales.
- Enlaces activos.
- Estados seleccionados.
- Elementos de marca.

### Naranja

Usar solo en acciones comerciales fuertes:

- Agregar al carrito.
- Comprar ahora.
- Finalizar compra.
- Publicar producto.
- Promociones.
- Etiquetas de oferta.

### Rojo

Reservar para:

- Errores.
- Eliminar.
- Cancelar pedido.
- Advertencias graves.

## 5. Tipografía

### Principal

- Inter.

Uso:

- Textos generales.
- Formularios.
- Tablas.
- Menús.
- Botones.

### Secundaria

- Poppins.

Uso:

- Títulos principales.
- Nombre de marca.
- Encabezados.
- Banners.

## 6. Escala tipográfica recomendada

- Título principal web: 36px a 48px, peso 700.
- Título principal móvil: 28px a 32px, peso 700.
- Subtítulos: 22px a 28px, peso 600.
- Títulos de tarjetas: 16px a 18px, peso 600.
- Texto normal: 14px a 16px, peso 400.
- Texto secundario: 13px a 14px, peso 400.
- Botones: 14px a 16px, peso 600.
- Precio de producto: 20px a 26px, peso 700.

## 7. Estilo de tarjetas

Las tarjetas son el componente visual base.

Deben tener:

- Fondo blanco.
- Borde suave.
- Sombra ligera.
- Esquinas redondeadas.
- Imagen arriba.
- Nombre visible.
- Precio destacado.
- Botón de acción.
- Etiquetas de oferta cuando aplique.

Ejemplo conceptual:

```text
┌─────────────────────────┐
│ Imagen producto         │
├─────────────────────────┤
│ Taladro percutor 750W   │
│ Marca / tienda          │
│ $280.000                │
│ [Agregar al carrito]    │
└─────────────────────────┘
```

## 8. Bordes, sombras y espaciado

### Bordes

- Elementos pequeños: 8px.
- Botones y formularios: 12px.
- Tarjetas destacadas: 16px.

### Sombras

Normal:

```css
box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
```

Hover:

```css
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
```

### Espaciado

- Pequeño: 8px.
- Medio: 16px.
- Grande: 24px.
- Separación de secciones: 48px.
- Padding de tarjetas: 16px a 24px.
- Padding de páginas: 24px a 64px.

## 9. Botones

### Principal

Uso:

- Iniciar sesión.
- Registrarse.
- Guardar cambios.

Estilo:

- Fondo `#2563EB`.
- Hover `#1E40AF`.
- Texto blanco.
- Border radius 12px.
- Peso 600.

### Comercial

Uso:

- Agregar al carrito.
- Comprar ahora.
- Finalizar compra.
- Confirmar pedido.

Estilo:

- Fondo `#F97316`.
- Hover `#EA580C`.
- Texto blanco.

### Secundario

Uso:

- Ver detalles.
- Cancelar.
- Volver.
- Seguir comprando.

Estilo:

- Fondo blanco.
- Texto azul.
- Borde azul.

## 10. Formularios

Deben ser claros y simples:

- Label visible.
- Placeholder útil.
- Mensaje de error cercano al campo.
- Estados focus con azul.
- Validación visual sin depender únicamente del color.

## 11. Header web

Debe incluir:

- Logo.
- Barra de búsqueda.
- Enlaces principales.
- Icono de carrito.
- Acceso a login/perfil.
- Menú responsive en móvil.

## 12. Estados visuales

- Éxito: verde.
- Error: rojo.
- Advertencia: amarillo/naranja.
- Información: azul.
- Inactivo/agotado: gris.

## 13. Accesibilidad

- Contraste suficiente.
- Botones con texto claro.
- Inputs con labels.
- Navegación responsive.
- Estados vacíos explicativos.
- Mensajes de error comprensibles.

## 14. Modo oscuro

No es obligatorio en MVP. Si se implementa, usar:

- Fondos oscuros `#0F172A`.
- Tarjetas `#111827`.
- Texto claro.
- Mantener azul y naranja como acentos.

## 15. Criterios de aceptación del diseño

- Se reconoce la marca CommerCity.
- El catálogo es claro y navegable.
- Los botones comerciales destacan sin saturar.
- Web y móvil son visualmente coherentes.
- La interfaz es usable en celular, tablet y escritorio.
- Los estados de error, éxito y vacío son claros.
