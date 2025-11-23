import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/db";

export async function GET() {
  try {
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);

    // Fetch only approved shops, selecting minimal fields
    const shops = await sellersCollection
      .find({ status: "approved" })
      .project({ 
        _id: 1, 
        shopName: 1, 
        profileImage: 1, 
        userId: 1 
      })
      .toArray();

    const formattedShops = shops.map((shop) => ({
      ...shop,
      _id: shop._id.toString(),
      userId: shop.userId.toString(),
    }));

    return NextResponse.json({ success: true, shops: formattedShops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}