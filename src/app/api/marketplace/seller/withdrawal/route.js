import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);

    const seller = await sellersCollection.findOne({
      userId: String(session.user._id),
    });

    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: seller.withdrawals || [],
    });

  } catch (error) {
    console.error("Withdrawal GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load withdrawal history" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { amount, method, number } = await req.json();

    if (!amount || amount < 200) {
      return NextResponse.json({
        success: false,
        message: "ন্যূনতম উত্তোলন পরিমাণ ৳২০০",
      });
    }

    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);

    const seller = await sellersCollection.findOne({
      userId: String(session.user._id),
    });

    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    const totalCommission = seller.commissions?.reduce(
      (sum, c) => sum + (c.amount || 0),
      0
    ) || 0;

    const pendingAmount = seller.withdrawals?.filter(w => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0) || 0;

    const available = totalCommission - pendingAmount;

    if (amount > available) {
      return NextResponse.json({
        success: false,
        message: "আপনার পর্যাপ্ত ব্যালেন্স নেই",
      });
    }

    const newWithdrawal = {
      amount,
      method,
      number,
      status: "pending",
      createdAt: Date.now(),
    };

    await sellersCollection.updateOne(
      { userId: String(session.user._id) },
      { $push: { withdrawals: newWithdrawal } }
    );

    return NextResponse.json({
      success: true,
      message: "উত্তোলনের অনুরোধ জমা হয়েছে",
      data: newWithdrawal,
    });
  } catch (error) {
    console.error("Withdrawal POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Withdrawal request failed" },
      { status: 500 }
    );
  }
}
