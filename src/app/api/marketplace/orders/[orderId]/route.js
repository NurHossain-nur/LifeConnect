import dbConnect, { collectionNamesObj } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return Response.json(
        { success: false, message: "Order ID required" },
        { status: 400 }
      );
    }

    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

    const result = await ordersCollection.deleteOne({
      _id: new ObjectId(orderId),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Order canceled" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting order:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
