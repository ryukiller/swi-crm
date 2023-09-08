import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from "@/lib/apiauth";

export async function GET(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `SELECT id, name, options, userChatId FROM users;`
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