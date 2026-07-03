SET @add_estado := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE comisiones ADD COLUMN estado ENUM(''pendiente'',''pagada'',''revisada'',''rechazada'') NOT NULL DEFAULT ''pendiente'' AFTER valor_vendedor',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comisiones' AND COLUMN_NAME = 'estado'
);
PREPARE stmt FROM @add_estado;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_updated_at := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE comisiones ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comisiones' AND COLUMN_NAME = 'updated_at'
);
PREPARE stmt FROM @add_updated_at;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
