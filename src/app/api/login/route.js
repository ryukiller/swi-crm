import pool from "../../../lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signJwtAccessToken } from "../../../lib/jwt"


export async function POST(req) {


  try {
    const body = await req.json()
    const { email, password } = body;

    console.log(email, password)

    // Find user in database
    const connection = await pool.getConnection();
    const results = await connection.query("SELECT * FROM users WHERE email = ?", [email]);


    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const user = results[0]

    if (user[0] && (await bcrypt.compare(password, user[0].password))) {
      const { password, created_at, updated_at, ...userWithoutPass } = user[0];
      const options = JSON.parse(userWithoutPass.options)
      userWithoutPass.options = options
      const accessToken = signJwtAccessToken(userWithoutPass);
      const result = {
        ...userWithoutPass,
        accessToken,
      };

      return new Response(JSON.stringify(result));
    } else return new Response(JSON.stringify(null));

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: "An error occurred while logging in" });
  }

}
