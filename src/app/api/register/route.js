import pool from '../../../lib/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function POST(req) {

    try {

        const body = await req.json();
        const { name, email, password } = body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const options = "{}"

        const connection = await pool.getConnection();
        const result = await connection.query('INSERT INTO users (name, email, password, options) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, options]);

        const userId = result.insertId;
        console.log(userId)

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log('Registration successful:', result);
        connection.release();
        NextResponse.json({ message: "User created", token });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Registration failed: Email already exists');
            NextResponse.json({ message: 'Registration failed: Email already exists' });
        } else {
            console.error('Registration failed:', error);
            NextResponse.json({ message: 'Registration failed' });
        }
    }

}
