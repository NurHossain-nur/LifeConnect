import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  const { productId } = params;
  const { name, comment, rating } = await req.json();

  const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);

  const review = { name, comment, rating, date: new Date().toISOString() };

  await productsCollection.updateOne(
    { _id: new ObjectId(productId) },
    { $push: { reviews: review } }
  );

  return new Response(JSON.stringify({ success: true, review }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
