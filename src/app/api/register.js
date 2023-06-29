import pool from '../../lib/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const connection = await pool.getConnection();
      const result = await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

      const userId = result.insertId;

      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

      console.log('Registration successful:', result);
      connection.release();
      res.status(200).json({ message: "User created", token });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Registration failed: Email already exists');
            res.status(409).json({ message: 'Registration failed: Email already exists' });
          } else {
            console.error('Registration failed:', error);
            res.status(500).json({ message: 'Registration failed' });
          }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
