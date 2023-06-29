import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT SUM(contract_amount) as total_sales, MONTH(contract_date) as month FROM contracts GROUP BY MONTH(contract_date)');
    connection.release();
   

    const data = {
        labels: rows.map((row) => row.month),
        datasets: [
          {
            label: 'Total Sales',
            data: rows.map((row) => parseFloat(row.total_sales)),
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      };

    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}
