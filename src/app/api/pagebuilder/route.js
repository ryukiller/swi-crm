import pool from "../../../lib/db";
import { NextResponse } from "next/server";

export default async function GET(req, res) {
  const { page_id } = req.query;
  try {
    const connection = await pool.getConnection();
    const results = await connection(
      `
    SELECT * FROM page_builder_data
  `
    );
    connection.release();

    if (results.length === 0) {
      return NextResponse.json({ message: "Pages not found" });
    }

    return NextResponse.json(JSON.parse(results[0].data));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
