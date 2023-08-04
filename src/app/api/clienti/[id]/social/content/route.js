// manage content table

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
            FROM social_timeline_content
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
        let { social_timeline_id, media, description, likes, comments, condivisioni, state } = body.data;


        const results = await connection.query(
            `
            INSERT INTO social_timeline_content (social_timeline_id, media, description, likes, comments, condivisioni, state)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            social_timeline_id = VALUES(social_timeline_id),
            media = VALUES(media), 
            description = VALUES(description), 
            likes = VALUES(likes),
            comments = VALUES(comments),
            condivisioni = VALUES(condivisioni),
            state = VALUES(state);
            `,
            [social_timeline_id, media, description, likes, comments, condivisioni, state]
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
        const { content_id } = body;

        if (!content_id) {
            return NextResponse.json({ message: "Missing required fields" });
        }

        const results = await connection.query(
            `DELETE FROM social_timeline_content WHERE id = ?;`,
            [content_id]
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