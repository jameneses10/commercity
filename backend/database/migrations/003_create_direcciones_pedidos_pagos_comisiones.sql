CREATE TABLE IF NOT EXISTS direcciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  codigo_postal VARCHAR(20) NULL,
  telefono VARCHAR(30) NOT NULL,
  es_principal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_direcciones_usuario_id (usuario_id),
  CONSTRAINT fk_direcciones_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  comprador_id INT UNSIGNED NOT NULL,
  direccion_id INT UNSIGNED NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado_pago ENUM('pendiente', 'pagado', 'rechazado', 'reembolsado') NOT NULL DEFAULT 'pendiente',
  estado_general ENUM('creado', 'procesando', 'enviado', 'completado', 'cancelado') NOT NULL DEFAULT 'creado',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pedidos_comprador_id (comprador_id),
  KEY idx_pedidos_direccion_id (direccion_id),
  KEY idx_pedidos_estado_pago (estado_pago),
  CONSTRAINT fk_pedidos_compradores FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_direcciones FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedido_detalles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  tienda_id INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_detalles_pedido_id (pedido_id),
  KEY idx_detalles_producto_id (producto_id),
  KEY idx_detalles_tienda_id (tienda_id),
  CONSTRAINT chk_detalles_cantidad_positiva CHECK (cantidad > 0),
  CONSTRAINT fk_detalles_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_detalles_productos FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_detalles_tiendas FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pagos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  metodo VARCHAR(50) NOT NULL,
  referencia VARCHAR(120) NOT NULL,
  estado ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL,
  mensaje VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pagos_pedido_id (pedido_id),
  KEY idx_pagos_estado (estado),
  UNIQUE KEY uk_pagos_referencia (referencia),
  CONSTRAINT fk_pagos_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comisiones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  tienda_id INT UNSIGNED NOT NULL,
  subtotal_tienda DECIMAL(12,2) NOT NULL,
  porcentaje_comision DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  valor_comision DECIMAL(12,2) NOT NULL,
  valor_vendedor DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_comisiones_pedido_tienda (pedido_id, tienda_id),
  KEY idx_comisiones_tienda_id (tienda_id),
  CONSTRAINT fk_comisiones_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_comisiones_tiendas FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
