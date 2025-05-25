import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "@/lib/models/User.js";
import sequelize from "../../../lib/sequelize.js";  // Adjusted path to go up 3 levels
import jwt from "jsonwebtoken";

// Define Zod schema for validation
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received signup data:", body); // Log the incoming data
    
    // Validate request body using Zod
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const { email, password } = body;

    // Log incoming request
    console.log("Signup Request Data:", { email, password });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log hashed password (without exposing it publicly)
    console.log("Hashed Password:", hashedPassword);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      // You can also add fields like `createdAt` if needed
    });

    // Log new user creation
    console.log("User Created:", { id: newUser.id, email: newUser.email });

    // Optional: Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your .env
      { expiresIn: '365d' } // Adjust token expiry as needed
    );

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser.id, email: newUser.email }, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}