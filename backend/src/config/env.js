const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'commercity_db',
    user: process.env.DB_USER || 'commercity_user',
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me_in_real_env',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

module.exports = env;
