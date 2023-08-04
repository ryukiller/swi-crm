// manage feed table

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
    const social_timeline_id = params.social_timeline_id;

    try {
        const connection = await pool.getConnection();
        const results = await connection.query(
            `
            SELECT *
            FROM social_timeline_feed
            WHERE social_timeline_id = ?;
       `,
            [social_timeline_id]
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
        let { social_timeline_id, type, comment, userid, date } = body.data;

        let parsedDate = new Date(date);
        // Check if the parsedDate is a valid date
        if (isNaN(parsedDate)) {
            return NextResponse.json({ message: "Invalid date format" });
        }

        // Convert the Date object back to a string in 'YYYY-MM-DD' format
        date = parsedDate.toISOString().slice(0, 10);

        const results = await connection.query(
            `
            INSERT INTO social_timeline_feed (social_timeline_id, type, comment, userid, date)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            social_timeline_id = VALUES(social_timeline_id),
            type = VALUES(type), 
            comment = VALUES(comment), 
            userid = VALUES(userid),
            date = VALUES(date);
            `,
            [social_timeline_id, type, comment, userid, date]
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
        const { feed_id } = body;

        if (!feed_id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        const results = await connection.query(
            `DELETE FROM social_timeline_feed WHERE id = ?;`,
            [feed_id]
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