import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/db";

export async function GET() {
  try {
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

    // Fetch only approved and active products
    const products = await productsCollection.find({ isApproved: true, status: "active" }).toArray();

    // Convert MongoDB ObjectId to string
    const formattedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      sellerId: p.sellerId.toString(),
      price: Number(p.price),
      discount: Number(p.discount || 0),
      stock: Number(p.stock),
      createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now(),
    }));

    return NextResponse.json({ success: true, products: formattedProducts });
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
