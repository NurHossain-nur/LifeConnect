import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, shopName, description } = await req.json();

    if (!shopName || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Connect to "sellers" collection
    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);

    // ✅ Check if the user already applied
    const existingApp = await sellersCollection.findOne({ userId: session.user._id });
    if (existingApp) {
      return NextResponse.json(
        { error: "You have already applied as a seller." },
        { status: 400 }
      );
    }

    // ✅ Create new application object
    const newApplication = {
      userId: session.user._id,
      name,
      email,
      shopName,
      description,
      status: "pending", // default status
      createdAt: new Date(),
    };

    // ✅ Insert into collection
    const result = await sellersCollection.insertOne(newApplication);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Seller Apply Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
