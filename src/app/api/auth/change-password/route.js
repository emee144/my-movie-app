import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
export async function PUT(req) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Both old and new passwords are required" }, { status: 400 });
    }
    await connectDB();

    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
