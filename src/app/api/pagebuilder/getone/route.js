import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page_id = searchParams.get('page_id');
  try {
    const connection = await pool.getConnection();
    const results = await connection.query(
      `
    SELECT data FROM preventivi
    WHERE slug = ?
  `,
      [page_id]
    );
    connection.release();

    if (results.length === 0) {
      return NextResponse.json({ message: "Page not found" });
    }
    
    const data = results[0]

    return NextResponse.json(JSON.parse(data[0].data));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
