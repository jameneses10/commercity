SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE usuarios ADD COLUMN fecha_nacimiento DATE NULL AFTER telefono', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'fecha_nacimiento');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE perfiles_usuarios ADD COLUMN foto_perfil_url VARCHAR(500) NULL AFTER foto_url', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'perfiles_usuarios' AND COLUMN_NAME = 'foto_perfil_url');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE perfiles_usuarios ADD COLUMN descripcion_personal TEXT NULL AFTER descripcion', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'perfiles_usuarios' AND COLUMN_NAME = 'descripcion_personal');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS producto_imagenes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  url_imagen VARCHAR(500) NOT NULL,
  nombre_original VARCHAR(255) NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  orden TINYINT UNSIGNED NOT NULL DEFAULT 0,
  es_principal BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_producto_imagenes_producto (producto_id),
  CONSTRAINT fk_producto_imagenes_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE conversaciones ADD COLUMN estado ENUM(''activa'',''archivada'',''bloqueada'') NOT NULL DEFAULT ''activa'' AFTER producto_id', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversaciones' AND COLUMN_NAME = 'estado');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE conversaciones ADD COLUMN creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER estado', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversaciones' AND COLUMN_NAME = 'creado_en');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE conversaciones ADD COLUMN actualizado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER creado_en', 'SELECT 1') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversaciones' AND COLUMN_NAME = 'actualizado_en');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS mensajes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversacion_id INT UNSIGNED NOT NULL,
  emisor_id INT UNSIGNED NOT NULL,
  contenido TEXT NULL,
  tipo ENUM('texto','archivo','mixto') NOT NULL DEFAULT 'texto',
  eliminado BOOLEAN NOT NULL DEFAULT FALSE,
  reportado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mensajes_conversacion (conversacion_id),
  KEY idx_mensajes_emisor (emisor_id),
  CONSTRAINT fk_mensajes_nuevo_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mensajes_nuevo_emisor FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mensaje_archivos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mensaje_id INT UNSIGNED NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  nombre_original VARCHAR(255) NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mensaje_archivos_mensaje (mensaje_id),
  CONSTRAINT fk_mensaje_archivos_nuevo_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensajes(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
