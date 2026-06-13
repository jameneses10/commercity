INSERT INTO roles (nombre, descripcion)
VALUES
  ('comprador', 'Usuario comprador que navega, compra, rastrea envíos y reseña productos.'),
  ('vendedor', 'Usuario vendedor que administra una tienda y sus operaciones comerciales.'),
  ('administrador', 'Usuario administrador general del marketplace creado solo por seed.')
ON DUPLICATE KEY UPDATE
  descripcion = VALUES(descripcion);
