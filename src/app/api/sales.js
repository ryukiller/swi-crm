import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT SUM(contract_amount) as total_sales, MONTH(contract_date) as month FROM contracts GROUP BY MONTH(contract_date)');
    connection.release();
    res.status(200).json({ totalSales: rows[0].total_sales, monthlySales: rows });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}