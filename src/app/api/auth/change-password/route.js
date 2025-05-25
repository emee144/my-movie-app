// app/api/auth/change-password/route.js
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import sequelize from '@app/lib/sequelize';  // Assuming you have a db file set up with your database connection

export async function PUT(req) {
  try {
    // Get the body data
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Both old and new passwords are required" }, { status: 400 });
    }

// Sequelize code for finding a user by ID
const user = await db.User.findOne({
    where: { id: req.user.id },  // Assuming `req.user.id` is set via middleware or JWT
  });
    // Find the user in the database  

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.User.update(
        { password: hashedPassword }, // data to be updated
        { where: { id: user.id } }    // condition to identify the record
      );
    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
