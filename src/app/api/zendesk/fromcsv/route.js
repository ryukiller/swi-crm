import pool from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    // const unauthorizedResponse = await verifyAccessToken(req);
    // if (unauthorizedResponse) {
    //     return unauthorizedResponse;
    // }

    try {
        const connection = await pool.getConnection();
        const body = await req.json();
        let { ticket_id, created_at, closed_at, type } = body;

        //created_at = new Date();

        if (!ticket_id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        let results;

        if (closed_at) {
            results = await connection.query(
                `
        INSERT INTO zen_tickets (ticket_id, created_at, closed_at, type)
        VALUES (?, ?, ?, ?);
       `,
                [ticket_id, created_at, closed_at, type]
            );
        } else {
            results = await connection.query(
                `
        INSERT INTO zen_tickets (ticket_id, created_at, type)
        VALUES (?, ?, ?);
       `,
                [ticket_id, created_at, type]
            );
        }


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