import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    // 1️⃣ Try to get logged-in session (but DO NOT require it)
    const session = await getServerSession(authOptions);

    // 2️⃣ Read request body
    const { customer, items } = await req.json();

    // 3️⃣ Validate input
    if (!customer || !customer.name || !customer.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer information required" }),
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Items are required" }),
        { status: 400 }
      );
    }

    // 4️⃣ Connect to DB
    const productsCollection = await dbConnect(collectionNamesObj.allSellersProductsCollection);
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

    // 5️⃣ If user is logged in → use DB user data
    //     else → guest checkout (no DB lookup)
    let customerData = null;

    if (session?.user?.email) {
      customerData = await usersCollection.findOne({ email: session.user.email });
    }

    let subtotal = 0;
    let totalDeliveryCharge = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, sellerId, quantity, price, deliveryCharge } = item;

      if (!productId || !sellerId || !quantity || !price || deliveryCharge === undefined) {
        throw new Error("Invalid product/seller info");
      }

      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
      if (!product) throw new Error(`Product ${productId} not found`);

      if (product.stock < quantity)
        throw new Error(`Only ${product.stock} units available for ${product.name}`);

      // Deduct stock
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { stock: -quantity } }
      );

      subtotal += price * quantity;
      totalDeliveryCharge += deliveryCharge;

      orderItems.push({
        productId,
        sellerId,
        quantity,
        price,
        deliveryCharge,
        status: "pending",
      });
    }

    const total = subtotal + totalDeliveryCharge;

    // 6️⃣ Customer info (guest or logged-in user)
    const orderCustomer = {
      customerId: customerData?._id?.toString() || null, // null if guest checkout
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      isGuest: !customerData, // helpful flag
    };

    // 7️⃣ Create order
    const newOrder = {
      customer: orderCustomer,
      items: orderItems,
      subtotal,
      totalDeliveryCharge,
      total,
      overallStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order placed successfully",
        orderId: result.insertedId,
        guestCheckout: !customerData,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Server error" }),
      { status: 500 }
    );
  }
}
