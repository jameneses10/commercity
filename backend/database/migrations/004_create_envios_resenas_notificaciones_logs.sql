CREATE TABLE IF NOT EXISTS envios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  tienda_id INT UNSIGNED NOT NULL,
  direccion_id INT UNSIGNED NOT NULL,
  transportadora VARCHAR(120) NULL,
  numero_guia VARCHAR(120) NULL,
  estado ENUM('pendiente','preparado','en_camino','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  fecha_envio DATETIME NULL,
  fecha_entrega DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_envios_pedido_tienda (pedido_id, tienda_id),
  KEY idx_envios_pedido_id (pedido_id),
  KEY idx_envios_tienda_id (tienda_id),
  KEY idx_envios_direccion_id (direccion_id),
  KEY idx_envios_estado (estado),
  CONSTRAINT fk_envios_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_envios_tiendas FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_envios_direcciones FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resenas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  comprador_id INT UNSIGNED NOT NULL,
  pedido_id INT UNSIGNED NOT NULL,
  estrellas TINYINT UNSIGNED NOT NULL,
  comentario TEXT NULL,
  estado ENUM('pendiente','aprobada','rechazada','ocultada') NOT NULL DEFAULT 'aprobada',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_resena_producto_comprador_pedido (producto_id, comprador_id, pedido_id),
  KEY idx_resenas_producto_id (producto_id),
  KEY idx_resenas_comprador_id (comprador_id),
  KEY idx_resenas_pedido_id (pedido_id),
  KEY idx_resenas_estado (estado),
  CONSTRAINT chk_resenas_estrellas CHECK (estrellas BETWEEN 1 AND 5),
  CONSTRAINT fk_resenas_productos FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_resenas_compradores FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_resenas_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notificaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notificaciones_usuario_id (usuario_id),
  KEY idx_notificaciones_leida (leida),
  CONSTRAINT fk_notificaciones_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS logs_acciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NULL,
  accion VARCHAR(120) NOT NULL,
  entidad VARCHAR(80) NOT NULL,
  entidad_id INT UNSIGNED NULL,
  detalle JSON NULL,
  ip VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_logs_usuario_id (usuario_id),
  KEY idx_logs_accion (accion),
  KEY idx_logs_entidad (entidad, entidad_id),
  CONSTRAINT fk_logs_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
