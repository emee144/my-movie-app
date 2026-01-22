import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
  
    const token = req.cookies.get("token");

    if (!token) {
      console.error("Token not found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    return NextResponse.json({ user: decoded });
  } catch (error) {

    console.error("Error verifying token:", error.message);

    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
