/* This is config file for TypeOrm */
require('dotenv').config();

const envs = process.env;

const config = {
  type: envs.DB_TYPE,
  host: envs.DB_HOST,
  database: envs.DB_DATABASE,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  port: envs.DB_PORT,
  logging: 'error',
  synchronize: false,
  maxQueryExecutionTime: 3000,
  cache: {
    type: 'redis',
    options: {
      port: envs.REDIS_PORT,
      host: envs.REDIS_HOST
    },
    duration: 30000
  }
};

/* Production and development specific settings */
if (process.env.NODE_ENV === 'production') {
  config.entities = ['dist/**/*.entity.js'];
} else {
  config.synchronize = true;
  // config.logging = 'all';
  config.migrations = ['db/migrations/*{.ts,.js}'];
  config.entities = ['src/**/*.entity{.ts,.js}'];
  config.migrationsRun = true;
}

module.exports = config;
