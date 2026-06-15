SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE notificaciones ADD COLUMN entidad_tipo VARCHAR(80) NULL AFTER mensaje', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notificaciones' AND COLUMN_NAME = 'entidad_tipo');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE notificaciones ADD COLUMN entidad_id INT UNSIGNED NULL AFTER entidad_tipo', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notificaciones' AND COLUMN_NAME = 'entidad_id');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE notificaciones ADD COLUMN url_destino VARCHAR(500) NULL AFTER entidad_id', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notificaciones' AND COLUMN_NAME = 'url_destino');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE notificaciones ADD COLUMN deleted_at DATETIME NULL AFTER created_at', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notificaciones' AND COLUMN_NAME = 'deleted_at');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE notificaciones ADD INDEX idx_notificaciones_deleted_at (deleted_at)', 'SELECT 1') FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notificaciones' AND INDEX_NAME = 'idx_notificaciones_deleted_at');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 1, "ALTER TABLE usuarios MODIFY COLUMN estado ENUM('activo','bloqueado','inactivo','baneado') NOT NULL DEFAULT 'activo'", 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='usuarios' AND COLUMN_NAME='estado' AND COLUMN_TYPE NOT LIKE '%baneado%');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS seguimientos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  seguidor_id INT UNSIGNED NOT NULL,
  seguido_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_seguimiento (seguidor_id, seguido_id),
  KEY idx_seguimientos_seguidor (seguidor_id),
  KEY idx_seguimientos_seguido (seguido_id),
  CONSTRAINT fk_seguimientos_seguidor FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_seguimientos_seguido FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  comprador_id INT UNSIGNED NOT NULL,
  vendedor_id INT UNSIGNED NOT NULL,
  tienda_id INT UNSIGNED NULL,
  producto_id INT UNSIGNED NULL,
  ultimo_mensaje_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_conversacion_contexto (comprador_id, vendedor_id, tienda_id, producto_id),
  KEY idx_conversaciones_comprador (comprador_id),
  KEY idx_conversaciones_vendedor (vendedor_id),
  KEY idx_conversaciones_tienda (tienda_id),
  KEY idx_conversaciones_producto (producto_id),
  CONSTRAINT fk_conversaciones_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_conversaciones_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_conversaciones_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_conversaciones_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mensajes_chat (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversacion_id INT UNSIGNED NOT NULL,
  emisor_id INT UNSIGNED NOT NULL,
  receptor_id INT UNSIGNED NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  leido_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mensajes_conversacion (conversacion_id),
  KEY idx_mensajes_receptor_leido (receptor_id, leido),
  CONSTRAINT fk_mensajes_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mensajes_emisor FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mensajes_receptor FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reportes_usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_reportado_id INT UNSIGNED NOT NULL,
  usuario_reportante_id INT UNSIGNED NOT NULL,
  motivo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('pendiente','revisado','rechazado','accionado') NOT NULL DEFAULT 'pendiente',
  respuesta_admin TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_reporte_usuario_estado (usuario_reportado_id, usuario_reportante_id, estado),
  KEY idx_reportes_usuarios_reportado (usuario_reportado_id),
  KEY idx_reportes_usuarios_reportante (usuario_reportante_id),
  KEY idx_reportes_usuarios_estado (estado),
  CONSTRAINT fk_reportes_usuarios_reportado FOREIGN KEY (usuario_reportado_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reportes_usuarios_reportante FOREIGN KEY (usuario_reportante_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
