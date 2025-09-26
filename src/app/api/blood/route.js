import dbConnect, { collectionNamesObj } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/donors
export const GET = async (req) => {
    const url = new URL(req.url);
    const params = url.searchParams;

    const query = {};

  if (params.get("name")) {
    query.name = { $regex: params.get("name"), $options: "i" };
  }
  if (params.get("bloodGroup") && params.get("bloodGroup") !== "All") {
    query.bloodGroup = params.get("bloodGroup");
  }
  if (params.get("district")) {
    query.district = params.get("district");
  }
  if (params.get("thana")) {
    query.thana = params.get("thana");
  }
  if (params.get("search")) {
    const search = params.get("search");
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

    const donorsCollection = dbConnect(collectionNamesObj.donorsCollection);
    const donors = await donorsCollection.find({}).toArray();
    return NextResponse.json(donors);
}


export const POST = async (req) => {
    const body = await req.json();
    const donorsCollection = dbConnect(collectionNamesObj.donorsCollection);
    const result = await donorsCollection.insertOne(body);

    return NextResponse.json(result);
}

