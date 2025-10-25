import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const { params } = await context;
  const userId = params.userId;

  try {
    const sellersCol = await dbConnect(collectionNamesObj.sellersCollection);
    const productsCol = await dbConnect(collectionNamesObj.allSellersProductsCollection);
    const ordersCol = await dbConnect(collectionNamesObj.orderCollection);

    // Step 1: Find seller by userId
    const seller = await sellersCol.findOne({ userId });
    if (!seller) {
      return new Response(JSON.stringify({ error: "Seller not found" }), { status: 404 });
    }

    const shopId = seller._id.toString();

    // Step 2: Fetch products by this shop
    const products = await productsCol.find({ sellerId: shopId }).toArray();

    // Step 3: Fetch orders containing this shop's products
    const orders = await ordersCol.find({ "items.sellerId": shopId }).toArray();

    // Step 4: Calculate revenue and item totals carefully
    let revenue = 0;
    const sellerOrders = orders.map(order => {
      // Only include items belonging to this seller
      const sellerItems = order.items
        .filter(item => item.sellerId === shopId)
        .map(item => {
          // Convert numbers from MongoDB format if needed
          const price = Number(item.price) || 0;
          const quantity = Number(item.quantity) || 0;
          const deliveryCharge = Number(item.deliveryCharge) || 0;
          return {
            ...item,
            price,
            quantity,
            deliveryCharge,
            total: price * quantity + deliveryCharge
          };
        });

      const total = sellerItems.reduce((sum, i) => sum + i.total, 0);
      revenue += total;

      // Determine order overall status for this seller
      const statusCounts = sellerItems.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
      }, {});
      const orderStatus = Object.keys(statusCounts).includes("pending")
        ? "pending"
        : Object.keys(statusCounts).includes("shipped")
        ? "shipped"
        : "delivered";

      return {
        ...order,
        items: sellerItems,
        total,
        status: orderStatus
      };
    });

    const response = {
      seller: {
        _id: seller._id,
        userId: seller.userId,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        description: seller.description,
        phoneNumber: seller.phoneNumber,
        address: seller.address,
        profileImage: seller.profileImage,
        status: seller.status,
        createdAt: seller.createdAt,
        approvedAt: seller.approvedAt,
        products: products.length,
        orders: sellerOrders.length,
        revenue,
        productList: products,
        orderList: sellerOrders
      }
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    console.error("Error fetching seller info:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
