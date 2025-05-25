import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { cookies } from "next/headers";
import User from "@/lib/models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        message: err.message,
        path: err.path[0],
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }    

    const { email, password } = body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: "365d" }
    );

    // Create response and set cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // Set to false for testing mode (not in production)
      sameSite: "Lax",
      path: "/",
      maxAge: 31536000, // 1 year in seconds
    });

    return response;
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    console.log("Token from cookie:", token);

    if (!token) {
      console.log("No token found in cookies.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      console.log("No user found with ID from token:", decoded.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.email);
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in token validation:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
