import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const ordersCollection = dbConnect(collectionNamesObj.orderCollection);
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

    // ✅ Fetch all orders for this user
    const userOrders = await ordersCollection
      .find({ "customer.customerId": session.user._id })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Fetch product details for all productIds in these orders
    const allProductIds = userOrders.flatMap((order) =>
      order.items.map((item) => item.productId)
    );

    const uniqueProductIds = [...new Set(allProductIds)];
    const products = await productsCollection
      .find({ _id: { $in: uniqueProductIds.map((id) => new ObjectId(id)) } })
      .project({ name: 1, images: 1, price: 1 })
      .toArray();

    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    // ✅ Attach product info to each order item
    const ordersWithProductInfo = userOrders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productInfo: productMap[item.productId] || null,
      })),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        orders: ordersWithProductInfo,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
