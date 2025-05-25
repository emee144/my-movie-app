import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import sequelize from "@/app/lib/sequelize"; // Ensure correct import
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic"; // Prevent API caching

// 🛠️ Utility function to verify JWT and return user ID
const verifyToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Not authenticated");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");

  return decoded.id; // Return user ID
};

// ✅ **Ensure Sequelize Models are Loaded**
const getUserModel = async () => {
  const { User } = sequelize.models;
  if (!User) throw new Error("User model is undefined. Check your Sequelize setup.");
  return User;
};

// 📌 GET: Fetch withdrawal settings
export async function GET() {
  try {
    const userId = verifyToken();
    const User = await getUserModel();

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["withdrawalMethod", "accountName", "bankName", "accountNumber"],
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET Error:", error.message);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

// 📌 PUT: Update withdrawal settings
export async function PUT(req) {
  try {
    const userId = verifyToken();
    const User = await getUserModel();

    const { withdrawalMethod, accountName, bankName, accountNumber } = await req.json();

    if (!withdrawalMethod || !accountName || !bankName || !accountNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 🔥 Ensure update works
    const [updated] = await User.update(
      { withdrawalMethod, accountName, bankName, accountNumber },
      { where: { id: userId } }
    );

    if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 500 });

    return NextResponse.json({ message: "Withdrawal settings updated successfully" });
  } catch (error) {
    console.error("PUT Error:", error.message);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}