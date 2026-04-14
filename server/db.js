const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sow_app',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => db.query(text, params),
};
