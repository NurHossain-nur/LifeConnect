// import dbConnect from "@/lib/db";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: "Credentials",
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" },
//         // email: { label: "Email", type: "email" }
//       },
//       async authorize(credentials, req) {
//         console.log(" Creadintial ", credentials);
//         // You need to provide your own logic here that takes the credentials
//         // submitted and returns either a object representing a user or value
//         // that is false/null if the credentials are invalid.
//         // return { id: 1, name: "J Smith", email: "jsmith@example.com" };
//         // You can also use the `req` object to obtain additional parameters
//         // (i.e., the request IP address)

//         // const res = await fetch("/your/endpoint", {
//         //   method: "POST",
//         //   body: JSON.stringify(credentials),
//         //   headers: { "Content-Type": "application/json" },
//         // });
//         // const user = await res.json();

//         const { username, password} = credentials
//         const user = await dbConnect("users").findOne({name: username})

//         const isPasswordOK = password == user.password

//         if (!user) {
//   // user not found, return null to signal failed login
//   return null;
// }

//         // If no error and we have user data, return it
//         if ( isPasswordOK) {
//           return user;
//         }
//         // Return null if user data could not be retrieved
//         return null;
//       },
//     }),
//   ],
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };









import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";




const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
