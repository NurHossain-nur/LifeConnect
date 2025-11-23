import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);

    const seller = await sellersCollection.findOne({
      userId: String(session.user._id),
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller profile not found" },
        { status: 404 }
      );
    }

    // Build summary
    const totalCommission = seller.commissions?.reduce(
      (sum, c) => sum + (c.amount || 0),
      0
    ) || 0;

    const pendingCommission = seller.commissions?.filter(
      (c) => c.status === "pending"
    ).reduce((sum, c) => sum + c.amount, 0) || 0;

    const approvedCommission = totalCommission - pendingCommission;

    return NextResponse.json({
      success: true,
      data: {
        referralCode: seller.referralCode,
        commissions: seller.commissions || [],
        totalCommission,
        pendingCommission,
        approvedCommission,
      },
    });

  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load referral info" },
      { status: 500 }
    );
  }
}
