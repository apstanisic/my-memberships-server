const path = require('path');
const dotenv = require('dotenv');

const roles = require('nestjs-extra').Role;
const notification = require('nestjs-extra').Notification;
const company = require('./src/companies/company.entity').Company;
const arrivals = require('./src/arrivals/arrival.entity').Arrival;
const subscriptions = require('./src/subscriptions/subscription.entity')
  .Subscription;
const pricingplan = require('./src/pricing-plans/pricing-plan.entity')
  .PricingPlan;
const locations = require('./src/locations/location.entity').Location;
const payment = require('./src/payments/payment-record.entity').PaymentRecord;
const user = require('./src/users/user.entity').User;
const locationImage = require('./src/location-images/location-image.entity')
  .LocationImage;
const companyImage = require('./src/company-images/company-image.entity')
  .CompanyImage;
const companyConfig = require('./src/company-config/company-config.entity')
  .CompanyConfig;

const nodeEnv = process.env.NODE_ENV || '';
const envs = dotenv.config({ path: `${nodeEnv}.env` }).parsed;

// const envs = process.env;
const entities = [
  company,
  arrivals,
  pricingplan,
  locations,
  payment,
  roles,
  notification,
  subscriptions,
  user,
  locationImage,
  companyImage,
  companyConfig,
];

const config = {
  entities,
  type: 'postgres',
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
      host: envs.REDIS_HOST,
    },
    duration: 30000,
  },
};

/* Production and development specific settings */
if (process.env.NODE_ENV === 'production') {
} else {
  // config.synchronize = true;
  config.logging = 'all';
  config.migrations = ['db/migrations/*{.ts,.js}'];
  // This is for migration
  // This is for webpack
  // config.entities = getMetadataArgsStorage().tables.map(tbl => tbl.target);
  // config.migrationsRun = true;
}

module.exports = config;
