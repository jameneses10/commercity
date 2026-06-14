SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN precio_anterior DECIMAL(10,2) NULL AFTER precio', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'precio_anterior');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN descuento_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0.00 AFTER precio_anterior', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'descuento_porcentaje');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN fecha_publicacion DATETIME NULL AFTER descuento_porcentaje', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'fecha_publicacion');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN fecha_caducidad DATETIME NULL AFTER fecha_publicacion', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'fecha_caducidad');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN reportado BOOLEAN NOT NULL DEFAULT FALSE AFTER fecha_caducidad', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'reportado');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE productos ADD COLUMN total_reportes INT NOT NULL DEFAULT 0 AFTER reportado', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'total_reportes');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS cuentas_bancarias_vendedores (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tienda_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  banco VARCHAR(120) NOT NULL,
  tipo_cuenta ENUM('ahorros','corriente','nequi','daviplata','simulada') NOT NULL DEFAULT 'simulada',
  numero_cuenta_simulado VARCHAR(80) NOT NULL,
  titular VARCHAR(160) NOT NULL,
  estado ENUM('activa','inactiva') NOT NULL DEFAULT 'activa',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cuenta_tienda (tienda_id),
  KEY idx_cuenta_usuario (usuario_id),
  CONSTRAINT fk_cuenta_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cuenta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reportes_productos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  motivo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('pendiente','revisado','rechazado','accionado') NOT NULL DEFAULT 'pendiente',
  respuesta_admin TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_reporte_producto_usuario_pendiente (producto_id, usuario_id, estado),
  KEY idx_reportes_producto (producto_id),
  KEY idx_reportes_usuario (usuario_id),
  KEY idx_reportes_estado (estado),
  CONSTRAINT fk_reportes_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reportes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
