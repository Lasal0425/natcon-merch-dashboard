import { Pool } from 'pg';

const pool = new Pool({
  host: "ap-southeast-1.89cd8caa-b155-464d-b634-87d88152a35d.aws.yugabyte.cloud",
  port: 5433,
  database: "yugabyte",
  user: "admin",
  password: "OvRgaEOzW72hr5k7VzeiXqYgtM_tIP",
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
