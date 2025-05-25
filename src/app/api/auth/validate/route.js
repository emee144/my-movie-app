import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Extract the token from the HTTP-only cookie
    const token = req.cookies.get("token");

    // If token is not present, return Unauthorized status
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode and verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, return the decoded user information
    return NextResponse.json({ user: decoded });
  } catch (error) {
    // If any error occurs during verification, return Invalid session status
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}