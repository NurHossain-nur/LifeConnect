import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db";

export async function GET() {
  try {
    // 1. Security Check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Connect to DB
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

    // 3. Parallel Data Fetching for Performance
    const [
      totalUsers,
      totalOrders,
      activeSellersCount,
      pendingSellersCount,
      totalRevenueResult,
      recentOrders,
      pendingSellers
    ] = await Promise.all([
      // Count Users
      usersCollection.countDocuments({}),
      
      // Count Orders
      ordersCollection.countDocuments({}),
      
      // Count Active Sellers
      sellersCollection.countDocuments({ status: "approved" }),
      
      // Count Pending Sellers
      sellersCollection.countDocuments({ status: "pending" }),
      
      // Calculate Total Revenue (Aggregation)
      ordersCollection.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]).toArray(),
      
      // Fetch Recent Orders (Limit 5)
      ordersCollection.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .project({ _id: 1, customer: 1, total: 1, overallStatus: 1, createdAt: 1 })
        .toArray(),
      
      // Fetch Pending Seller Requests (Limit 5 for sidebar)
      sellersCollection.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .project({ _id: 1, name: 1, shopName: 1, createdAt: 1 })
        .toArray()
    ]);

    // 4. Format Data
    const dashboardData = {
      totalUsers,
      totalOrders,
      activeSellers: activeSellersCount,
      pendingSellerCount: pendingSellersCount,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      recentOrders: recentOrders.map(order => ({
        ...order,
        _id: order._id.toString() // Ensure ID is string for frontend
      })),
      pendingSellers: pendingSellers.map(seller => ({
        ...seller,
        _id: seller._id.toString()
      })),
    };

    return NextResponse.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}