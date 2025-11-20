// import { MongoClient, ServerApiVersion } from "mongodb";

// export const collectionNamesObj = {
//   donorsCollection: "blood_donor",
//   usersCollection: "users",
//   sellersCollection: "sellers",
//   allSellersProductsCollection: "sellers_products",
//   orderCollection: "orders"
// };

// export default function dbConnect(collectionName) {
//   const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
//   // Create a MongoClient with a MongoClientOptions object to set the Stable API version

//   const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },
//   });
// //   await client.connect();
//   return client.db(process.env.DB_NAME).collection(collectionName);
// }








import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export const collectionNamesObj = {
  donorsCollection: "blood_donor",
  usersCollection: "users",
  sellersCollection: "sellers",
  allSellersProductsCollection: "sellers_products",
  orderCollection: "orders"
};

export default async function dbConnect(collectionName) {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
}
