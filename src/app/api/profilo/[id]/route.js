import pool from "../../../../lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../../../lib/apiauth";

export async function GET(req, context) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const connection = await pool.getConnection();
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const results = await connection.query(
      `
             SELECT id, name, options, email, role, userChatId FROM users WHERE id = ?;
             `,
      [id]
    );
    connection.release();

    if (results.length === 0) {
      return NextResponse.json({ message: "No user found" });
    }
    const data = results[0];

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
