// app/api/marketplace/products/[productId]/route.js
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { productId } = await params; // ✅ params is already available

  if (!productId) {
    return new Response(JSON.stringify({ error: "Missing productId" }), { status: 400 });
  }

  try {
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
