import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/authOptions";

export const config = { api: { bodyParser: false } }; // disable default JSON parser

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Parse form data
    const formData = await request.formData();
    const productId = formData.get("productId");
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Extract other fields
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const sku = formData.get("sku");
    const deliveryCharge = parseFloat(formData.get("deliveryCharge")) || 0;
    const discount = parseFloat(formData.get("discount")) || 0;
    const status = formData.get("status") || "inactive";
    const tags = formData.get("tags")?.split(",").map((t) => t.trim()) || [];
    const existingImages = formData.getAll("existingImages"); // old images
    const newImages = formData.getAll("newImages"); // newly uploaded files

    // Connect to collections
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);

    // ✅ Find seller
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

    // ✅ Upload new images to Cloudinary
    const uploadedImageUrls = [];
    for (const image of newImages) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      uploadedImageUrls.push(uploadResult.secure_url);
    }

    // Merge old images with newly uploaded images
    const allImages = [...existingImages, ...uploadedImageUrls];

    // ✅ Prepare update object
    const updateData = {
      name,
      description,
      category,
      brand,
      price,
      stock,
      sku,
      deliveryCharge,
      discount,
      status,
      tags,
      images: allImages,
      updatedAt: new Date(),
    };

    // ✅ Update product
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
