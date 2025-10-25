import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email or Phone", type: "text", placeholder: "Email or Phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Normalize phone number: remove non-digit characters, ensure starts with +
          let identifier = credentials.identifier || credentials.username || "";
          const isPhone = /^\+?\d{8,15}$/.test(identifier.replace(/\s/g, ""));
          if (isPhone && !identifier.startsWith("+")) {
            identifier = `+${identifier.replace(/\D/g, "")}`;
          }

          const res = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password: credentials.password }),
          });

          const user = await res.json();

          if (res.ok && user) {
            // Return user object
            return user;
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
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
