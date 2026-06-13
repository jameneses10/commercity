INSERT INTO categorias (nombre, slug, descripcion, estado)
VALUES
  ('Tecnología', 'tecnologia', 'Productos tecnológicos, electrónicos y accesorios digitales.', 'activa'),
  ('Hogar', 'hogar', 'Productos para el hogar, decoración y organización.', 'activa'),
  ('Moda', 'moda', 'Ropa, calzado y tendencias de moda.', 'activa'),
  ('Ferretería', 'ferreteria', 'Herramientas, materiales y productos de ferretería.', 'activa'),
  ('Belleza', 'belleza', 'Cuidado personal, cosmética y belleza.', 'activa'),
  ('Deportes', 'deportes', 'Artículos deportivos, entrenamiento y bienestar físico.', 'activa'),
  ('Accesorios', 'accesorios', 'Accesorios personales y complementos diversos.', 'activa')
ON DUPLICATE KEY UPDATE
  descripcion = VALUES(descripcion),
  estado = VALUES(estado);
