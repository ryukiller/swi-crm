import { createPool } from 'mysql2/promise';

const params = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = createPool(process.env.PS_DB_URL);

export default pool;