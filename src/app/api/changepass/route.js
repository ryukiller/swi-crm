import pool from '../../../lib/db';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req) {
    let connection;
    try {

        const onlyadmin = true;

        if (!onlyadmin) {

            const body = await req.json();
            const { id, password } = body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const connection = await pool.getConnection();
            const result = await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

            console.log('pass changed:', result);
            return NextResponse.json({ message: "pass changed" }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'error changing pass' }, { status: 500 });
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'error changing pass' }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }

}
