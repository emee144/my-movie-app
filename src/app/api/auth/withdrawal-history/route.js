import { NextResponse } from "next/server";
import Withdrawal from "@/app/lib/models/Withdrawal"; // Sequelize model for Withdrawal
import { validateToken } from "@/app/lib/auth"; // Your authentication helper
import { cookies } from "next/headers"; // Import cookies utility
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating IDs

// ✅ GET: Fetch withdrawal history for the authenticated user
export async function GET() {
  try {
    console.log("GET request received for withdrawal history");
    const cookieStore = cookies(); // ✅ get the cookie store
    const token = cookieStore.get("token")?.value; // Read token from cookies
    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "Token missing or expired" }, { status: 401 });
    }

    const user = await validateToken(token);
    console.log("Authenticated user:", user);
    console.log("User ID in API route:", user?.id);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    console.log("GET withdrawal history for user ID:", user.id);
    // Fetch user's withdrawal history and select specific fields
    const withdrawals = await Withdrawal.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "amount", "tax", "net", "status", "createdAt", "updatedAt"], // Select specific fields
    });
    console.log("Fetched withdrawals:", withdrawals);
    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST: Submit a new withdrawal request for the authenticated user
export async function POST(request) {
  try {
    const token = cookies().get("token")?.value; // Read token from cookies
    if (!token) {
      return NextResponse.json({ error: "Token missing or expired" }, { status: 401 });
    }

    const user = await validateToken(token);
    console.log("POST withdrawal for user ID:", user?.id);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, tax, net } = body;

    // Check for valid withdrawal input
    if (
      typeof amount !== "number" ||
      typeof tax !== "number" ||
      typeof net !== "number" ||
      amount <= 0 ||
      tax < 0 || // Ensure tax can't be negative
      net <= 0 || // Ensure net withdrawal is positive
      net !== amount - tax  // Ensure amount equals tax + net
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newWithdrawal = await Withdrawal.create({
      id: uuidv4(),
      userId: user.id,
      amount,
      tax,
      net,
      status: "completed", // Set status to completed by default
    });

    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
