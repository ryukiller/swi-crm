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
    UPDATE preventivi
    SET data = ?,
        updated = CURRENT_TIMESTAMP()
    WHERE slug = ?;
    `, [JSON.stringify(data), page_id]);
    connection.release();
    return NextResponse.json({ message: 'Page saved successfully' });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: 'Internal server error' })
  }
}

