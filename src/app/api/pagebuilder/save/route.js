import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const res = await req.json();
  const { page_id, data } = res;

  try {
    if (!page_id || !data) {
      return NextResponse.json({ message: '`page_id` and `data` are both required' });
    }
    const connection = await pool.getConnection();
    await connection.query(`
      INSERT INTO preventivi (slug, data)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE data = ?, updated = CURRENT_TIMESTAMP;
    `, [page_id, JSON.stringify(data), JSON.stringify(data)]);
    connection.release();
    return NextResponse.json({ message: 'Page saved successfully' });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: 'Internal server error' })
  }
}

