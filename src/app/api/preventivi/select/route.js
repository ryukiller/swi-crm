// list all preventivi
import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const connection = await pool.getConnection();
    const results = await connection.query(
      `
    SELECT id AS clienti, name FROM clients;
     `
    );
    

    if (results.length === 0) {
      return NextResponse.json({ message: "Page not found" });
    }

    const results2 = await connection.query(
        `
      SELECT id AS categorie, titolo AS name FROM categorie_preventivi;
       `
      );
      connection.release();
  
      if (results2.length === 0) {
        return NextResponse.json({ message: "Page not found" });
      }

    const data = [
        results[0],
       results2[0]
    ];
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
