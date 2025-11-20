import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Only admins can view seller list
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const applications = await sellersCollection.find().toArray();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Fetch Sellers Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
