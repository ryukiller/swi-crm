/*

feature vista cliente

TODO:
- statistiche
 - Analytics
 - AdWords
 - Facebook
 - Instagram
 - TikTok
 - Youtube
- Info Cliente
 - lista Contratti con relative date inizio, scadenza, ammontare, id agente, servizi nel contratto
 - Ragione Sociale e multiple 
 - domini/hosting e scadenze
 - categoria merceologica
 - conteggio pacchetto ore
- FeedBack lavori e ticket
 - Integrazione con Wrike
 - Integrazione con ZenDesk

*/

import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
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
    SELECT * FROM clients;
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
    const { stato, name, email, phone_number, website, notes, property, facebookid } = body;

    if (!name || !email || !phone_number || !website) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const results = await connection.query(
      `
        INSERT INTO clients (stato, name, email, phone_number, website, notes, property, facebookid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        stato = VALUES(stato),
        name = VALUES(name),
        email = VALUES(email), 
        phone_number = VALUES(phone_number),
        website = VALUES(website),
        notes = VALUES(notes),
        property = VALUES(property),
        facebookid = VALUES(facebookid),
        updated_at = CURRENT_TIMESTAMP;
       `,
      [stato, name, email, phone_number, website, notes, property, facebookid]
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
      `DELETE FROM clients WHERE id = ?;`,
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
         UPDATE clients SET stato = ? WHERE id = ?;
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