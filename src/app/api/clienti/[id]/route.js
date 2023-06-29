import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from "../../../../lib/apiauth";

export async function GET(req, { params }) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    //const { searchParams } = new URL(req.url);
    const id = params.id;

    console.log(id)

    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `
            SELECT * FROM clients WHERE id = ${id};
            `
        );
        const contratti = await connection.query(
            `SELECT * FROM contracts WHERE client_id = ${id}`
        )
        connection.release();

        if (results.length === 0) {
            return NextResponse.json({ message: "Page not found" });
        }

        const data = results[0];
        data[0].contratti = contratti[0];
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" });
    }

}