// get posts and create post

import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from "@/lib/apiauth";

export async function GET(req, { params }) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    //const { searchParams } = new URL(req.url);
    const id = params.id;
    console.log("ciao")
    console.log(id)


    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `
            SELECT * 
            FROM social_timeline ST 
            LEFT JOIN social_timeline_feed F ON ST.id = F.social_timeline_id 
            LEFT JOIN social_timeline_content C ON ST.id = C.social_timeline_id 
            WHERE ST.client_id = ?;
       `,
            [id]
        );
        connection.release();

        if (results.length === 0) {
            return NextResponse.json({ message: "no posts found" });
        }

        const data = results[0];

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server errors" });
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
        const { date, type, moodboardlink, client_id } = body;

        const results = await connection.query(
            `
            INSERT INTO social_timeline (date, type, moodboardlink, client_id)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            date = VALUES(date), 
            type = VALUES(type), 
            moodboardlink = VALUES(moodboardlink), 
            client_id = VALUES(client_id);
            `,
            [date, type, moodboardlink, client_id]
        );
        connection.release();

        if (results.length === 0) {
            return NextResponse.json({ message: "failed to insert" });
        }

        const data = results[0];

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" });
    }

}