import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);

    // 1️⃣ Find the seller record linked to this logged-in user
    const seller = await sellersCollection.findOne({
      userId: session.user._id,
      status: "approved", // optional: only fetch approved sellers
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found or not approved" },
        { status: 403 }
      );
    }

    const productsCollection = dbConnect(
      collectionNamesObj.allSellersProductsCollection
    );

    // 2️⃣ Fetch all products belonging to this seller
    const products = await productsCollection
      .find({ sellerId: seller._id.toString() })
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}





// DELETE product
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);

    // 1️⃣ Get seller record from session
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

    const productsCollection = dbConnect(
      collectionNamesObj.allSellersProductsCollection
    );

    // 2️⃣ Delete product only if it belongs to this seller
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(productId),
      sellerId: seller._id.toString(),
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { success: false, message: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - update product status
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, newStatus } = await request.json();
    if (!productId || !newStatus) {
      return NextResponse.json(
        { success: false, message: "Product ID and status required" },
        { status: 400 }
      );
    }

    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);

    // 1️⃣ Get seller record from session
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

    const productsCollection = dbConnect(
      collectionNamesObj.allSellersProductsCollection
    );

    // 2️⃣ Update status only if product belongs to this seller
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId), sellerId: seller._id.toString() },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );

    if (!result.modifiedCount) {
      return NextResponse.json(
        { success: false, message: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error updating product status:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}