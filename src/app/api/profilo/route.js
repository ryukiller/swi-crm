import pool from "../../../lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken } from '../../../lib/apiauth';

export async function PATCH(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }
    
    try {
      const connection = await pool.getConnection();
      const body = await req.json();
      const { id, name, options } = body;
  
      if (!id) {
        return NextResponse.json({ message: "Missing required fields" });
      }
  
      const results = await connection.query(
        `
           UPDATE users SET name = ?, options = ? WHERE id = ?;
           `,
        [name, JSON.stringify(options), id]
      );
      connection.release();
  
      if (results.affectedRows === 0) {
        return NextResponse.json({ message: "Failed to update user" });
      }
      const data = results[0];
      return NextResponse.json(data);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Internal server error" });
    }
  }