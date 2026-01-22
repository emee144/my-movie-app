import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import Withdrawal from "@/lib/models/Withdrawal";
import sequelize from "@/app/lib/sequelize";
import { validateToken } from "@/lib/auth";

// Ensure the DB is connected and synced (only once)
await sequelize.sync();

// 🔁 Utility to get authenticated user
async function getAuthenticatedUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return await validateToken(token);
}

// ✅ GET: Get withdrawals for authenticated user
export async function GET() {
  console.log("[WITHDRAWAL][GET] Request received");

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("[WITHDRAWAL][GET] Invalid or missing token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const withdrawals = await Withdrawal.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "amount", "tax", "net", "status", "createdAt", "updatedAt"],
    });

    console.log(`[WITHDRAWAL][GET] Found ${withdrawals.length} records`);
    return NextResponse.json(withdrawals);
  } catch (err) {
    console.error("[WITHDRAWAL][GET] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST: Create a new withdrawal
export async function POST(request) {
  console.log("[WITHDRAWAL][POST] Request received");

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("[WITHDRAWAL][POST] Invalid or missing token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Incoming withdrawal request data:", body);  // Log the full body of the request
    const { amount, tax, net } = body;

    // Validate input
    const isValid =
      typeof amount === "number" &&
      typeof tax === "number" &&
      typeof net === "number" &&
      amount > 0 &&
      tax >= 0 &&
      net > 0 &&
      net === amount - tax;

    if (!isValid) {
      console.warn("[WITHDRAWAL][POST] Invalid input:", body);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.log("Creating new withdrawal:", { amount, tax, net, userId: user.id });

    const newWithdrawal = await Withdrawal.create({
      id: uuidv4(),
      userId: user.id,
      amount,
      tax,
      net,
      status: "completed",
    });

    console.log("New withdrawal created:", newWithdrawal); // Log the created withdrawal
    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}