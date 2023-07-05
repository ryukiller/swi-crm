import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.PS_HOST,
  user: process.env.PS_USER,
  password: process.env.PS_PASS,
  database: process.env.PS_DB,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;