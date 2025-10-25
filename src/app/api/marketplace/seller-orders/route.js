import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "seller") {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);
    const ordersCollection = dbConnect(collectionNamesObj.orderCollection);
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);

    // ✅ Step 1: Find the seller document using userId from session
    const sellerDoc = await sellersCollection.findOne({
      userId: session.user._id,
    });

    if (!sellerDoc) {
      return new Response(
        JSON.stringify({ success: false, message: "Seller profile not found" }),
        { status: 404 }
      );
    }

    const sellerId = sellerDoc._id.toString(); // this matches product.sellerId

    // ✅ Step 2: Find all orders containing this seller’s products
    const allOrders = await ordersCollection
      .find({ "items.sellerId": sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Step 3: Collect product IDs for this seller
    const productIds = allOrders.flatMap((order) =>
      order.items
        .filter((item) => item.sellerId === sellerId)
        .map((item) => item.productId)
    );

    const uniqueProductIds = [...new Set(productIds)];
    const products = await productsCollection
      .find({ _id: { $in: uniqueProductIds.map((id) => new ObjectId(id)) } })
      .project({ name: 1, images: 1, price: 1 })
      .toArray();

    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    // ✅ Step 4: Filter items for this seller
    const sellerOrders = allOrders.map((order) => ({
      _id: order._id,
      customer: order.customer,
      createdAt: order.createdAt,
      overallStatus: order.overallStatus,
      items: order.items
        .filter((item) => item.sellerId === sellerId)
        .map((item) => ({
          ...item,
          productInfo: productMap[item.productId] || null,
        })),
    }));

    return new Response(
      JSON.stringify({ success: true, orders: sellerOrders }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Seller orders error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}




export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "seller") {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { orderId, productId, newStatus } = await req.json();

    if (!orderId || !productId || !newStatus) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const sellersCollection = dbConnect(collectionNamesObj.sellersCollection);
    const ordersCollection = dbConnect(collectionNamesObj.orderCollection);

    // ✅ Find the seller document
    const sellerDoc = await sellersCollection.findOne({
      userId: session.user._id,
    });

    if (!sellerDoc) {
      return new Response(
        JSON.stringify({ success: false, message: "Seller not found" }),
        { status: 404 }
      );
    }

    const sellerId = sellerDoc._id.toString();

    // ✅ Use arrayFilters to specifically update the correct item
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: { "items.$[elem].status": newStatus },
        $currentDate: { updatedAt: true },
      },
      {
        arrayFilters: [
          {
            "elem.productId": productId,
            "elem.sellerId": sellerId,
          },
        ],
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Order or item not found" }),
        { status: 404 }
      );
    }

    // ✅ Recalculate the overall order status
    const updatedOrder = await ordersCollection.findOne({
      _id: new ObjectId(orderId),
    });

    const allStatuses = updatedOrder.items.map((item) => item.status);
    let overallStatus = "pending";
    if (allStatuses.every((s) => s === "delivered")) overallStatus = "delivered";
    else if (allStatuses.some((s) => s === "shipped")) overallStatus = "shipped";

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { overallStatus } }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Status updated successfully",
        overallStatus,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update seller order error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

