const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function migrate() {
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    await runSqlFile(filePath);
    console.log(`Migración ejecutada: ${file}`);
  }

  await pool.end();
}

migrate().catch(async (error) => {
  console.error('Error ejecutando migraciones:', error.message);
  await pool.end();
  process.exit(1);
});
