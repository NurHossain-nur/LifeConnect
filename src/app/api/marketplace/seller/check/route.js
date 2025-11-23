import dbConnect, { collectionNamesObj } from "@/lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ success: false, message: "User ID missing" }, { status: 400 });
    }

    const sellers = await dbConnect(collectionNamesObj.sellersCollection);

    const application = await sellers.findOne({ userId });

    return Response.json({
      success: true,
      application
    });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
