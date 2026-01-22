import { NextResponse } from "next/server";
import Withdrawal from "@/lib/models/Withdrawal";
import { validateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token missing or expired" }, { status: 401 });
    }

    const user = await validateToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const withdrawals = await Withdrawal.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "amount", "tax", "net", "status", "createdAt", "updatedAt"],
    });

    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token missing or expired" }, { status: 401 });
    }

    const user = await validateToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, tax, net } = body;

    if (
      typeof amount !== "number" ||
      typeof tax !== "number" ||
      typeof net !== "number" ||
      amount <= 0 ||
      tax < 0 ||
      net <= 0 ||
      net !== amount - tax
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newWithdrawal = await Withdrawal.create({
      id: uuidv4(),
      userId: user.id,
      amount,
      tax,
      net,
      status: "completed",
    });

    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}