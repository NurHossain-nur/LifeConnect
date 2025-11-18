import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const url = new URL(req.url);
  const pathname = url.pathname; // e.g., /api/marketplace/sellers/68fc5f5fed626a86044f2afd
  const parts = pathname.split("/");
  const sellerId = parts[parts.length - 1]; // last part of path

  if (!sellerId) {
    return new Response(JSON.stringify({ error: "Missing sellerId" }), { status: 400 });
  }

  try {
    const sellersCol = await dbConnect(collectionNamesObj.sellersCollection);
    const seller = await sellersCol.findOne({ _id: new ObjectId(sellerId) });

    if (!seller) {
      return new Response(JSON.stringify({ error: "Seller not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        shopName: seller.shopName,
        name: seller.name,
        profileImage: seller.profileImage,
        bannerImage: seller.bannerImage || null,
        phoneNumber: seller.phoneNumber,
        address: seller.address,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

