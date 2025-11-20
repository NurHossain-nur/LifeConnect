// import dbConnect, { collectionNamesObj } from "@/lib/db";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export const POST = async (req) => {
//   try {
//     const { username, password } = await req.json();

//     const usersCollection = dbConnect(collectionNamesObj.usersCollection);

//     const user = await usersCollection.findOne({ name: username });
//     console.log("User found:", user);

//     if (!user) {
//       console.log(`Login failed: User with name '${username}' not found.`);
//       return NextResponse.json({ error: "User not found" }, { status: 401 });
//     }

//     const isPasswordValid = password === user.password;
//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log(`Password valid for user '${username}':`, isPasswordValid);

//     if (!isPasswordValid) {
//       console.log(`Login failed: Password validation failed for user '${username}'.`);
//       return NextResponse.json({ error: "Invalid password" }, { status: 401 });
//     }

//     // Successful login — exclude password from response
//     const { password: _, ...userWithoutPassword } = user;
//     console.log(`Login success for user '${username}'.`);
//     return NextResponse.json(userWithoutPassword);
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// };




import dbConnect, { collectionNamesObj } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { identifier, password } = await req.json();

    // Normalize phone number if needed
    let normalizedIdentifier = identifier;
    const isPhone = /^\+?\d{8,15}$/.test(identifier.replace(/\s/g, ""));
    if (isPhone && !identifier.startsWith("+")) {
      normalizedIdentifier = `+${identifier.replace(/\D/g, "")}`;
    }

    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);

    // Find user by email OR phone
    const user = await usersCollection.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedIdentifier }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = password === user.password;
    // If using hashed passwords, uncomment below:
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
