import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, ...updateData } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Connect to collections
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const productsCollection = await dbConnect(
      collectionNamesObj.allSellersProductsCollection
    );

    // 1️⃣ Find seller record using user ID
    const seller = await sellersCollection.findOne({
      userId: session.user._id,
      status: "approved",
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found or not approved" },
        { status: 403 }
      );
    }

    // 2️⃣ Clean and prepare data
    if (typeof updateData.images === "string")
      updateData.images = updateData.images.split("\n").map((img) => img.trim());

    if (typeof updateData.tags === "string")
      updateData.tags = updateData.tags.split(",").map((t) => t.trim());

    updateData.updatedAt = new Date();

    // 3️⃣ Update product only if belongs to this seller
    const updateResult = await productsCollection.updateOne(
      { _id: new ObjectId(productId), sellerId: seller._id.toString() },
      { $set: updateData }
    );

    if (!updateResult.matchedCount) {
      return NextResponse.json(
        { success: false, message: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedProduct = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
