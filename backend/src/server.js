const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`CommerCity API escuchando en http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} recibido. Cerrando servidor CommerCity...`);
  server.close(() => {
    console.log('Servidor cerrado correctamente.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
