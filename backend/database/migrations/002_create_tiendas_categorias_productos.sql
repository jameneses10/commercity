CREATE TABLE IF NOT EXISTS tiendas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  descripcion TEXT NULL,
  logo_url VARCHAR(500) NULL,
  banner_url VARCHAR(500) NULL,
  estado ENUM('activa', 'pausada', 'suspendida') NOT NULL DEFAULT 'activa',
  reputacion_promedio DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  nivel_reputacion ENUM('platino', 'oro', 'regular') NOT NULL DEFAULT 'regular',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tiendas_usuario_id (usuario_id),
  UNIQUE KEY uk_tiendas_nombre (nombre),
  UNIQUE KEY uk_tiendas_slug (slug),
  KEY idx_tiendas_estado (estado),
  CONSTRAINT fk_tiendas_usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_categorias_nombre (nombre),
  UNIQUE KEY uk_categorias_slug (slug),
  KEY idx_categorias_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tienda_id INT UNSIGNED NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('activo', 'agotado', 'oculto', 'eliminado') NOT NULL DEFAULT 'activo',
  imagen_url VARCHAR(500) NULL,
  calificacion_promedio DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  total_resenas INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_productos_tienda_slug (tienda_id, slug),
  KEY idx_productos_tienda_id (tienda_id),
  KEY idx_productos_categoria_id (categoria_id),
  KEY idx_productos_estado (estado),
  KEY idx_productos_precio (precio),
  KEY idx_productos_nombre (nombre),
  CONSTRAINT chk_productos_precio_positivo CHECK (precio > 0),
  CONSTRAINT chk_productos_stock_no_negativo CHECK (stock >= 0),
  CONSTRAINT fk_productos_tiendas
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_productos_categorias
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
