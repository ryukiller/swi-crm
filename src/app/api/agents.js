import pool from '../../lib/db';

export default async function handler(req, res) {
if (req.method === 'GET') {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT agents.name as name, COUNT(contracts.id) as contracts_count, SUM(contracts.contract_amount) as total_sales FROM agents LEFT JOIN contracts ON agents.id = contracts.agent_id GROUP BY agents.id');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
} else if (req.method === 'POST') {
    //create agent
}
}