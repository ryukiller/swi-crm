// list all preventivi
import pool from "../../../lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../../lib/apiauth";

export async function GET(req) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const connection = await pool.getConnection();
    const results = await connection.query(
      `
    SELECT preventivi.*, categorie_preventivi.titolo AS category_name, clients.name AS client_name 
    FROM preventivi 
    INNER JOIN categorie_preventivi ON preventivi.categoria = categorie_preventivi.id 
    INNER JOIN clients ON preventivi.cliente = clients.id;
     `
    );
    connection.release();

    if (results.length === 0) {
      return NextResponse.json({ message: "Page not found" });
    }

    const data = results[0];
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}

export async function POST(req) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const connection = await pool.getConnection();
    const body = await req.json();
    const { title, totale, state, cliente, categoria, note, slug, data } = body;

    if (!title || !totale || !cliente || !categoria || !slug) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const dataToSave = typeof data === "string" ? data : JSON.stringify(data);

    const results = await connection.query(
      `
        INSERT INTO preventivi (title, totale, state, cliente, categoria, note, slug, data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        title = VALUES(title), 
        totale = VALUES(totale), 
        state = VALUES(state), 
        cliente = VALUES(cliente), 
        categoria = VALUES(categoria), 
        note = VALUES(note), 
        updated = CURRENT_TIMESTAMP,
        data = VALUES(data);
       `,
      [title, totale, state, cliente, categoria, note, slug, dataToSave]
    );
    connection.release();

    if (results.affectedRows === 0) {
      return NextResponse.json({ message: "Failed to save data" });
    }

    return NextResponse.json({ message: "Data saved successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}

export async function PUT(req) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  try {
    const connection = await pool.getConnection();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const results = await connection.query(
      `DELETE FROM preventivi WHERE id = ?;`,
      [id]
    );
    connection.release();

    if (results.affectedRows === 0) {
      return NextResponse.json({ message: "Failed to delete data" });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server errors" });
  }
}

export async function PATCH(req) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const connection = await pool.getConnection();
    const body = await req.json();
    const { id, state } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const results = await connection.query(
      `
         UPDATE preventivi SET state = ? WHERE id = ?;
         `,
      [state, id]
    );
    connection.release();

    if (results.affectedRows === 0) {
      return NextResponse.json({ message: "Failed to change state" });
    }

    return NextResponse.json({ message: "State changed successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
