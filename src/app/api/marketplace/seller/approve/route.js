import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // ✅ Ensure user is logged in
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Ensure only admins can approve sellers
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { userId, action } = await req.json(); // action = "approve" | "reject"

    console.log(userId);
    if (!userId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // ✅ Get DB collections
    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);
    const usersCollection = dbConnect(collectionNamesObj.usersCollection);

    // ✅ Find the application
    const application = await sellersCollection.findOne({ userId });
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // ✅ Handle approval/rejection logic
    if (action === "approve") {
      // Update seller status
      await sellersCollection.updateOne(
        { userId },
        { $set: { status: "approved", approvedAt: new Date() } }
      );

      // Update user role to "seller"
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { role: "seller" } }
      );

      return NextResponse.json({ message: "✅ Seller approved successfully!" }, { status: 200 });
    }

    if (action === "reject") {
      await sellersCollection.updateOne(
        { userId },
        { $set: { status: "rejected", rejectedAt: new Date() } }
      );

      return NextResponse.json({ message: "❌ Seller application rejected." }, { status: 200 });
    }
  } catch (error) {
    console.error("Admin Approve Seller Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
