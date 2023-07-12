// list all preventivi
import pool from "../../../lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../../lib/apiauth";

export async function GET(req) {
    // const unauthorizedResponse = await verifyAccessToken(req);
    // if (unauthorizedResponse) {
    //     return unauthorizedResponse;
    // }

    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `
    SELECT * FROM zen_tickets;
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
    // const unauthorizedResponse = await verifyAccessToken(req);
    // if (unauthorizedResponse) {
    //     return unauthorizedResponse;
    // }

    try {
        const connection = await pool.getConnection();
        const body = await req.json();
        const { ticket_id, created_at, updated_at, closed_at, type } = body;

        if (!ticket_id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        const results = await connection.query(
            `
        INSERT INTO zen_tickets (ticket_id, created_at, updated_at, closed_at, type)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        ticket_id = VALUES(ticket_id), 
        created_at = VALUES(created_at), 
        updated_at = VALUES(updated_at), 
        closed_at = VALUES(closed_at), 
        type = VALUES(type);
       `,
            [ticket_id, created_at, updated_at, closed_at, type]
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

export async function PATCH(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const connection = await pool.getConnection();
        const body = await req.json();
        const { ticket_id, updated_at, closed_at } = body;

        if (!id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        const results = await connection.query(
            `
         UPDATE preventivi SET updated_at = ?, closed_at = ? WHERE ticket_id = ?;
         `,
            [ticket_id, updated_at, closed_at]
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
