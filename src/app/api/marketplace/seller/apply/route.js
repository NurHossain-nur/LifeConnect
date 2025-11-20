import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto"; // Node built-in for code generation
import { ObjectId } from "mongodb"; // For queries

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const shopName = formData.get("shopName");
    const description = formData.get("description");
    const phoneNumber = formData.get("phoneNumber");
    const address = formData.get("address");
    const profileImageFile = formData.get("profileImage");
    const bannerImageFile = formData.get("bannerImage");
    const paymentMethod = formData.get("paymentMethod");
    const senderNumber = formData.get("senderNumber");
    const transactionId = formData.get("transactionId");
    const paymentProofFile = formData.get("paymentProof");
    let referralCode = formData.get("referralCode")?.toUpperCase() || ""; // Optional, uppercase

    if (!shopName || !description || !phoneNumber || !address || !paymentMethod || !senderNumber || !transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const uploadToCloudinary = async (file, folder) => {
      if (!file || !(file instanceof File) || file.size === 0) return ""; // Fix: Check if it's a valid File object
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

    const profileImageUrl = await uploadToCloudinary(profileImageFile, "seller_profiles");
    const bannerImageUrl = await uploadToCloudinary(bannerImageFile, "seller_banners");
    const paymentProofUrl = await uploadToCloudinary(paymentProofFile, "seller_payment_proofs");

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);

    const existingApp = await sellersCollection.findOne({ userId: session.user._id });
    if (existingApp) {
      return NextResponse.json({ error: "You have already applied as a seller." }, { status: 400 });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await sellersCollection.findOne({
        referralCode,
        status: "approved", // Only approved sellers can refer
      });
      if (referrer) {
        referredBy = referrer.userId;
      } else {
        return NextResponse.json({ error: "Invalid referral code." }, { status: 400 });
      }
    }

    // Generate unique referral code (8 chars, uppercase hex)
    let newReferralCode;
    let codeExists = true;
    while (codeExists) {
      newReferralCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      codeExists = await sellersCollection.findOne({ referralCode: newReferralCode });
    }

    const FEE_AMOUNT = 500;

    const newApplication = {
      userId: session.user._id,
      name,
      email,
      shopName,
      description,
      phoneNumber,
      address,
      profileImage: profileImageUrl,
      bannerImage: bannerImageUrl,
      paymentDetails: {
        amount: FEE_AMOUNT,
        method: paymentMethod,
        senderNumber,
        transactionId,
        proofUrl: paymentProofUrl,
      },
      referredBy, // ObjectId or null
      referralCode: newReferralCode,
      commissions: [], // Array for future commissions
      status: "pending",
      createdAt: new Date(),
    };

    const result = await sellersCollection.insertOne(newApplication);

    return NextResponse.json(
      {
        message: "Application submitted successfully! Awaiting payment verification.",
        applicationId: result.insertedId,
        referralCode: newReferralCode, // Return to frontend
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Seller Apply Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}