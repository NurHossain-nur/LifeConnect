import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Collections
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);
    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

    // Seller profile
    const seller = await sellersCollection.findOne({
      userId: String(session.user._id),
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller profile not found" },
        { status: 404 }
      );
    }

    const sellerId = String(seller._id);

    // Count Products
    const totalProducts = await productsCollection.countDocuments({ sellerId });

    // Get all orders containing this seller's products
    const allOrders = await ordersCollection
      .find({ "items.sellerId": sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    // ---- NEW FORMAT ----
    const recentOrders = allOrders.slice(0, 5).map((order) => {
      const sellerItems = order.items.filter(
        (item) => String(item.sellerId) === sellerId
      );

      return {
        id: String(order._id),
        customer: order.customer?.name || "Unknown",
        status: order.overallStatus || "pending",
        amount: order.total ?? 0, // numeric amount
        items: sellerItems.map((item) => ({
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };
    });

    // Flattens only for quick stats
    const sellerOrderItems = allOrders.flatMap((order) =>
      order.items.filter((i) => String(i.sellerId) === sellerId)
    );

    // Orders This Month
    const now = new Date();
    const ordersThisMonth = sellerOrderItems.filter((i) => {
      const d = new Date(i.createdAt || now);
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }).length;

    // Total Revenue
    const totalRevenue = sellerOrderItems.reduce(
      (sum, i) => sum + (i.price * (i.quantity || 1)),
      0
    );

    // Pending Shipments
    const pendingShipments = sellerOrderItems.filter(
      (i) => i.status?.toLowerCase() === "pending"
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        sellerName: seller.name,
        shopName: seller.shopName,
        profileImage: seller.profileImage,
        bannerImage: seller.bannerImage,

        totalProducts,
        ordersThisMonth,
        totalRevenue,
        pendingShipments,

        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
