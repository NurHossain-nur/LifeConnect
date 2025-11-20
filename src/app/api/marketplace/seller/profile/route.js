import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const seller = await sellersCollection.findOne({ userId: String(session.user._id) });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: seller.name,
        shopName: seller.shopName,
        email: seller.email,
        phoneNumber: seller.phoneNumber,
        address: seller.address,
        description: seller.description,
        status: seller.status,
        profileImage: seller.profileImage,
      },
    });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load seller info" },
      { status: 500 }
    );
  }
}
