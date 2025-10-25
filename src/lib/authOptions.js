import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log(credentials);
        // Call your login API route, make sure URL is correct
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        console.log("aakfhah", user);

        if (res.ok && user) {
            // Make sure _id is string, not ObjectId
        //   user._id = user._id ? user._id.toString() : null;
          return user; // Must be an object, e.g. { id, name, email }
        }

        return null; // If login fails
      },
    }),
  ],
  session: {
    strategy: "jwt", // or 'database' if you want DB sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token on login
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
};