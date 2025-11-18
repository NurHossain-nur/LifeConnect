// app/api/products/[productId]/route.js
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { productId } = params;

  const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

  const product = await productsCollection.findOne({
    _id: new ObjectId(productId),
  });

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(product));
}
