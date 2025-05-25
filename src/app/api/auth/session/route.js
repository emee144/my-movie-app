import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Extract the token from the HTTP-only cookie
    const token = req.cookies.get("token");

    // Debugging: Log if the token is missing
    if (!token) {
      console.error("Token not found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode and verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging: Log the decoded token
    console.log("Decoded token:", decoded);

    // If token is valid, return the decoded user information
    return NextResponse.json({ user: decoded });
  } catch (error) {
    // Debugging: Log the error
    console.error("Error verifying token:", error.message);

    // If any error occurs during verification, return Invalid session status
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
