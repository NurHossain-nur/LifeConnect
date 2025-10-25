import dbConnect, { collectionNamesObj } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email ||!phone || !password ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const usersCollection = dbConnect(collectionNamesObj.usersCollection); // assuming your collection is usersCollection

    // Optional: check if user already exists (by email)
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // TODO: Hash password before saving, e.g. using bcrypt

    const result = await usersCollection.insertOne({ name, email, phone, password, role: "user" });

    return NextResponse.json({ message: "User registered", id: result.insertedId });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
