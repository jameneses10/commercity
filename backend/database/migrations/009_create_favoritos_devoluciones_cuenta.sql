CREATE TABLE IF NOT EXISTS favoritos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_favoritos_usuario_producto (usuario_id, producto_id),
  KEY idx_favoritos_usuario (usuario_id),
  KEY idx_favoritos_producto (producto_id),
  CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_favoritos_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devoluciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  numero_solicitud VARCHAR(40) NOT NULL,
  pedido_id INT UNSIGNED NOT NULL,
  comprador_id INT UNSIGNED NOT NULL,
  tienda_id INT UNSIGNED NOT NULL,
  estado ENUM('solicitada','en_revision','aprobada','rechazada','reembolso_simulado','cerrada') NOT NULL DEFAULT 'solicitada',
  motivo VARCHAR(160) NOT NULL,
  descripcion TEXT NULL,
  respuesta_vendedor TEXT NULL,
  respuesta_admin TEXT NULL,
  monto_estimado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resuelto_en DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_devoluciones_numero (numero_solicitud),
  KEY idx_devoluciones_pedido (pedido_id),
  KEY idx_devoluciones_comprador (comprador_id),
  KEY idx_devoluciones_tienda (tienda_id),
  KEY idx_devoluciones_estado (estado),
  CONSTRAINT fk_devoluciones_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_devoluciones_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_devoluciones_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devolucion_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  devolucion_id INT UNSIGNED NOT NULL,
  pedido_detalle_id INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_devolucion_item_detalle (devolucion_id, pedido_detalle_id),
  KEY idx_devolucion_items_detalle (pedido_detalle_id),
  KEY idx_devolucion_items_producto (producto_id),
  CONSTRAINT chk_devolucion_items_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_devolucion_items_devolucion FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_devolucion_items_detalle FOREIGN KEY (pedido_detalle_id) REFERENCES pedido_detalles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_devolucion_items_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devolucion_evidencias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  devolucion_id INT UNSIGNED NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  nombre_original VARCHAR(255) NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_devolucion_evidencias_devolucion (devolucion_id),
  CONSTRAINT fk_devolucion_evidencias_devolucion FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN modo_oscuro BOOLEAN NOT NULL DEFAULT FALSE AFTER ultimo_login_at', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'modo_oscuro');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN preferencias_notificaciones JSON NULL AFTER modo_oscuro', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'preferencias_notificaciones');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN cuenta_desactivada BOOLEAN NOT NULL DEFAULT FALSE AFTER preferencias_notificaciones', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'cuenta_desactivada');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN fecha_desactivacion DATETIME NULL AFTER cuenta_desactivada', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'fecha_desactivacion');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN solicitud_eliminacion_estado ENUM(''ninguna'',''pendiente'',''aprobada'',''rechazada'') NOT NULL DEFAULT ''ninguna'' AFTER fecha_desactivacion', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'solicitud_eliminacion_estado');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN solicitud_eliminacion_fecha DATETIME NULL AFTER solicitud_eliminacion_estado', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'solicitud_eliminacion_fecha');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN solicitud_eliminacion_respuesta_admin TEXT NULL AFTER solicitud_eliminacion_fecha', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'solicitud_eliminacion_respuesta_admin');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN anonimizado BOOLEAN NOT NULL DEFAULT FALSE AFTER solicitud_eliminacion_respuesta_admin', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'anonimizado');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD INDEX idx_usuarios_solicitud_eliminacion (solicitud_eliminacion_estado)', 'SELECT 1') FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND INDEX_NAME = 'idx_usuarios_solicitud_eliminacion');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
