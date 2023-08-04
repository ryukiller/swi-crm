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
            FROM social_timeline 
            WHERE client_id = ?;
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
        let { date, type, moodboardlink, client_id } = body.data;

        let parsedDate = new Date(date);
        // Check if the parsedDate is a valid date
        if (isNaN(parsedDate)) {
            return NextResponse.json({ message: "Invalid date format" });
        }

        // Convert the Date object back to a string in 'YYYY-MM-DD' format
        date = parsedDate.toISOString().slice(0, 10);

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


export async function PUT(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }
    try {
        const connection = await pool.getConnection();
        const body = await req.json();
        const { post_id } = body.data;

        if (!post_id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        await connection.beginTransaction();
        await connection.query('DELETE FROM social_timeline_feed WHERE social_timeline_id = ?', [post_id]);
        await connection.query('DELETE FROM social_timeline_content WHERE social_timeline_id = ?', [post_id]);
        const [results] = await connection.query('DELETE FROM social_timeline WHERE id = ?', [post_id]);
        await connection.commit();

        connection.release();

        if (results.affectedRows === 0) {
            return NextResponse.json({ message: "Failed to delete data" });
        }

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        // If we get an error, we must rollback the transaction
        connection.rollback();
        connection.release();

        console.log(error);
        return NextResponse.json({ message: "Internal server errors" });
    }
}