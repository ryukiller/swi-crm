import pool from "../../../../lib/db"
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../../../lib/apiauth";

export async function GET(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `SELECT * FROM categorie_preventivi;`
        );
        connection.release();

        if (results.length === 0) {
            return NextResponse.json({ message: "Categorie non trovate" });
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

        //Insert
        const { title } = body;

        if (!title) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        const results = await connection.query(
            `
        INSERT INTO categorie_preventivi (titolo, descrizione, prezzo_medio)
        VALUES (?,?,?)
        ON DUPLICATE KEY UPDATE 
        titolo = VALUES(titolo),
        descrizione = VALUES(descrizione),
        prezzo_medio = VALUES(prezzo_medio);
       `,
            [title, title, 1]
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