import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/authOptions";

export async function POST(request) {
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
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const sku = formData.get("sku");
    const images = formData.getAll("images");
    const tags = formData.get("tags")?.split(",").map((t) => t.trim()) || [];
    const discount = parseFloat(formData.get("discount")) || 0;
    const deliveryCharge = parseFloat(formData.get("deliveryCharge")) || 0;

    if (!name || !description || !category || !price || !stock) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Upload images to Cloudinary
    const imageUrls = [];
    for (const image of images) {
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

      imageUrls.push(uploadResult.secure_url);
    }

    // ✅ Get seller info from "sellers" collection
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const seller = await sellersCollection.findOne({
      userId: session.user._id,
      status: "approved", // only approved sellers can add products
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found or not approved yet" },
        { status: 403 }
      );
    }

    // ✅ Connect to product collection
    const productsCollection = await dbConnect(
      collectionNamesObj.allSellersProductsCollection
    );

    // ✅ Build product document
    const newProduct = {
      name,
      description,
      category,
      brand,
      price,
      stock,
      sku,
      images: imageUrls,
      sellerId: seller._id.toString(),
      sellerEmail: seller.email,
      sellerName: seller.name,
      shopName: seller.shopName,
      addedBy: seller.name,
      addedByRole: "seller", // can be changed to "admin" if admin adds product
      isApproved: true, // or false if admin approval required
      tags,
      discount,
      deliveryCharge,
      ratings: [], // optional future feature
      reviews: [], // optional future feature
      priceHistory: [
        {
          price,
          date: new Date(),
        },
      ],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ✅ Insert into MongoDB
    const result = await productsCollection.insertOne(newProduct);

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      productId: result.insertedId,
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
