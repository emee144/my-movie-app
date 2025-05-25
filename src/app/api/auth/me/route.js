import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check expiry manually (optional, jwt.verify usually does this)
    const expiryDate = new Date(decoded.exp * 1000);
    if (expiryDate < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 401 });
    }

    // Extract user info to send (adjust based on your token structure)
    const userData = decoded.user || { name: decoded.name, email: decoded.email };

    return NextResponse.json({ user: userData }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Invalid token" }, { status: 401 });
  }
}
