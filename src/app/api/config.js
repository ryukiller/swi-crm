import pool from '../../lib/db';

export default async function handler(req, res) {
    //const {id} = req.query
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT *
      FROM config
      WHERE user_type LIKE "cliente"
    `);
   connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}