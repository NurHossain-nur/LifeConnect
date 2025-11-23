import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/db";

export async function GET() {
  try {
    const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);

    // Fetch latest 8 active products
    const products = await productsCollection
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    // Convert _id to string for frontend compatibility
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json({ success: true, products: formattedProducts });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}