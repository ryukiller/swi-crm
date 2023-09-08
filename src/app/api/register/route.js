import pool from '../../../lib/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export async function POST(req) {
    let connection;
    try {

        const body = await req.json();
        const { name, email, password } = body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userChatId = uuidv4();

        const options = {
            userChatId: userChatId
        }

        const connection = await pool.getConnection();
        const result = await connection.query('INSERT INTO users (name, email, password, options, userChatId) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, JSON.stringify(options), userChatId]);

        const userId = result[0].insertId;

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log('Registration successful:', result);
        return NextResponse.json({ message: "User created", token }, { status: 200 });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Registration failed: Email already exists');
            return NextResponse.json({ message: 'Registration failed: Email already exists' }, { status: 409 });
        } else {
            console.error('Registration failed:', error);
            return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
        }
    } finally {
        if (connection) connection.release();
    }

}
