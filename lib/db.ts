import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.YUGABYTE_HOST,
  port: parseInt(process.env.YUGABYTE_PORT || '5433'),
  database: process.env.YUGABYTE_DATABASE,
  user: process.env.YUGABYTE_USER,
  password: process.env.YUGABYTE_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
