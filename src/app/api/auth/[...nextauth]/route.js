import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";

async function getUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection("users").findOne({ email });
}

async function createUser({ name, email, password, provider }) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const users = db.collection("users");

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const newUser = {
    name,
    email,
    password: hashedPassword,
    provider,
    createdAt: new Date(),
  };

  await users.insertOne(newUser);
  return newUser;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password || "");
        if (!isValid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await getUserByEmail(user.email);
        if (!existingUser) await createUser({ name: user.name, email: user.email, password: null, provider: "google" });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.name = user.name; token.email = user.email; }
      return token;
    },
    async session({ session, token }) {
      if (token) session.user = { id: token.id, name: token.name, email: token.email };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 
