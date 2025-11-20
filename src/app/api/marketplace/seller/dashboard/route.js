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

    // 1️⃣ DB Collections
    const sellersCollection = await dbConnect(collectionNamesObj.sellersCollection);
    const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);
    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

    // 2️⃣ Find seller profile
    const seller = await sellersCollection.findOne({ userId: String(session.user._id) });
    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller profile not found" },
        { status: 404 }
      );
    }

    const sellerId = String(seller._id);

    // 3️⃣ Count Products
    const totalProducts = await productsCollection.countDocuments({ sellerId });

    // 4️⃣ Fetch All Orders containing this seller
    const allOrders = await ordersCollection
      .find({ "items.sellerId": sellerId })
      .toArray();

    // 5️⃣ Flatten all seller’s items across orders
    const sellerOrderItems = allOrders.flatMap((order) =>
      order.items
        .filter((item) => item.sellerId === sellerId)
        .map((item) => ({
          orderId: order._id,
          customerName: order.customer?.name || "Unknown",
          createdAt: order.createdAt,
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
          status: item.status,
        }))
    );

    // 6️⃣ Orders This Month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ordersThisMonth = sellerOrderItems.filter((item) => {
      const d = new Date(item.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // 7️⃣ Total Revenue (price × quantity)
    const totalRevenue = sellerOrderItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    // 8️⃣ Pending Shipments (items still pending)
    const pendingShipments = sellerOrderItems.filter(
      (item) => item.status?.toLowerCase() === "pending"
    ).length;

    // 9️⃣ Recent Orders (last 5 items)
    const recentOrders = sellerOrderItems
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((item) => ({
        id: String(item.orderId),
        productId: item.productId,
        customer: item.customerName,
        status: item.status,
        amount: `$${(item.price * item.quantity).toFixed(2)}`,
      }));

    // 🔟 Return Result
    return NextResponse.json({
      success: true,
      data: {
        sellerName: seller.name,
        shopName: seller.shopName,
        totalProducts,
        ordersThisMonth,
        totalRevenue,
        pendingShipments,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
