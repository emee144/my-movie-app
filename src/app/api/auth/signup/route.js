import { NextResponse } from "next/server";
import { z } from "zod";
import User from "@/lib/models/User.js";
import connectDB from "@/lib/mongodb.js";
import jwt from "jsonwebtoken";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const { email, password } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await User.create({ email, password });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );
    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser._id, email: newUser.email }, token },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
