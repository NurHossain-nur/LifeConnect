// import dbConnect, { collectionNamesObj } from "@/lib/db";
// import { ObjectId } from "mongodb";

// export async function POST(req) {
//   try {
//     const { customer, items } = await req.json();

//     if (!customer || !items || !Array.isArray(items) || items.length === 0) {
//       return new Response(JSON.stringify({ success: false, message: "Invalid order data" }), { status: 400 });
//     }

//     // Connect to collections
//     const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);
//     const ordersCollection = dbConnect(collectionNamesObj.orderCollection);

//     let subtotal = 0;
//     let totalDeliveryCharge = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const { productId, sellerId, quantity, price, deliveryCharge } = item;

//       if (!productId || !sellerId || !quantity || !price || deliveryCharge === undefined) {
//         throw new Error("Missing product or seller info");
//       }

//       const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
//       if (!product) throw new Error(`Product ${productId} not found`);
//       if (product.stock < quantity) throw new Error(`Only ${product.stock} units of ${product.name} available`);

//       // Deduct stock
//       await productsCollection.updateOne(
//         { _id: new ObjectId(productId) },
//         { $inc: { stock: -quantity } }
//       );

//       subtotal += price * quantity;
//       totalDeliveryCharge += deliveryCharge;

//       orderItems.push({
//         productId: new ObjectId(productId),
//         sellerId: new ObjectId(sellerId),
//         quantity,
//         price,
//         deliveryCharge,
//         status: "pending", // <-- NEW
//       });
//     }

//     const total = subtotal + totalDeliveryCharge;

//     const newOrder = {
//       customer: {
//         customerId: customer.customerId ? new ObjectId(customer.customerId) : null,
//         name: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//       },
//       items: orderItems,
//       subtotal,
//       totalDeliveryCharge,
//       total,
//       overallStatus: "pending", // <-- NEW field
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await ordersCollection.insertOne(newOrder);

//     return new Response(JSON.stringify({
//       success: true,
//       message: "Order placed successfully",
//       orderId: result.insertedId,
//     }), { status: 200 });

//   } catch (error) {
//     console.error("Checkout error:", error);
//     return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), { status: 500 });
//   }
// }








import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth"; // if using next-auth
// import { authOptions } from "@/lib/auth"; // adjust to your auth config path

export async function POST(req) {
  try {
    // ✅ Get logged-in user (NextAuth)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized user" }),
        { status: 401 }
      );
    }

    const { customer, items } = await req.json();

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid order data" }),
        { status: 400 }
      );
    }

    // ✅ Connect to MongoDB collections
    const productsCollection = dbConnect(collectionNamesObj.allSellersProductsCollection);
    const usersCollection = dbConnect(collectionNamesObj.usersCollection);
    const ordersCollection = dbConnect(collectionNamesObj.orderCollection);

    // ✅ Fetch logged-in user's details
    const customerData = await usersCollection.findOne({ email: session.user.email });
    if (!customerData)
      throw new Error("Customer not found in database");

    let subtotal = 0;
    let totalDeliveryCharge = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, sellerId, quantity, price, deliveryCharge } = item;

      if (!productId || !sellerId || !quantity || !price || deliveryCharge === undefined) {
        throw new Error("Missing product or seller info");
      }

      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
      if (!product) throw new Error(`Product ${productId} not found`);
      if (product.stock < quantity)
        throw new Error(`Only ${product.stock} units of ${product.name} available`);

      // Deduct stock
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { stock: -quantity } }
      );

      subtotal += price * quantity;
      totalDeliveryCharge += deliveryCharge;

      orderItems.push({
        productId: productId, // ✅ Save as string
        sellerId: sellerId,   // ✅ Save as string
        quantity,
        price,
        deliveryCharge,
        status: "pending", // per-item status
      });
    }

    const total = subtotal + totalDeliveryCharge;

    // ✅ Create new order record
    const newOrder = {
      customer: {
        customerId: customerData._id.toString(), // ✅ from logged-in user
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
      },
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
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Server error",
      }),
      { status: 500 }
    );
  }
}
