import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import Withdrawal from "@/lib/models/Withdrawal";
import { validateToken } from "@/lib/auth";

async function getAuthenticatedUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return await validateToken(token);
}

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const withdrawals = await Withdrawal.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(withdrawals);
  } catch (err) {
    console.error("[WITHDRAWAL][GET] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, tax, net } = await req.json();

    const isValid =
      typeof amount === "number" &&
      typeof tax === "number" &&
      typeof net === "number" &&
      amount > 0 &&
      tax >= 0 &&
      net > 0 &&
      net === amount - tax;

    if (!isValid) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const newWithdrawal = await Withdrawal.create({
      _id: uuidv4(),
      userId: user.id,
      amount,
      tax,
      net,
      status: "completed",
    });

    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error("[WITHDRAWAL][POST] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
