import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId"); // get ?sellerId=...
console.log(sellerId);
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

    const query = { isApproved: true, status: "active" };
    if (sellerId) {
      query.sellerId = sellerId;
    }

    const products = await productsCollection.find(query).toArray();

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
