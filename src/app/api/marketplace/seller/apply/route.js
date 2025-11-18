import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse FormData
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const shopName = formData.get("shopName");
    const description = formData.get("description");
    const phoneNumber = formData.get("phoneNumber");
    const address = formData.get("address");
    const profileImageFile = formData.get("profileImage");
    const bannerImageFile = formData.get("bannerImage"); // new field

    if (!shopName || !description || !phoneNumber || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Helper function to upload image to Cloudinary
    const uploadToCloudinary = async (file, folder) => {
      if (!file || file.size === 0) return "";
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      return uploadResult.secure_url;
    };

    // ✅ Upload profile image
    const profileImageUrl = await uploadToCloudinary(profileImageFile, "seller_profiles");

    // ✅ Upload banner image
    const bannerImageUrl = await uploadToCloudinary(bannerImageFile, "seller_banners");

    // ✅ Connect to "sellers" collection
    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);

    // ✅ Check if the user already applied
    const existingApp = await sellersCollection.findOne({ userId: session.user._id });
    if (existingApp) {
      return NextResponse.json(
        { error: "You have already applied as a seller." },
        { status: 400 }
      );
    }

    // ✅ Create new application object
    const newApplication = {
      userId: session.user._id,
      name,
      email,
      shopName,
      description,
      phoneNumber,
      address,
      profileImage: profileImageUrl,
      bannerImage: bannerImageUrl, // store uploaded banner URL
      status: "pending",
      createdAt: new Date(),
    };

    // ✅ Insert into collection
    const result = await sellersCollection.insertOne(newApplication);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: result.insertedId,
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Seller Apply Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
