import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { client } from "../../../lib/sanity";

export const authOptions: NextAuthOptions = {
  providers: [
<<<<<<< HEAD
    GitHubProvider({
=======
    GithubProvider({
>>>>>>> 52b640f (fix: build errors resolved, production ready)
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
<<<<<<< HEAD
      if (account?.provider !== "github") return true;

      try {
        // Check if author already exists
=======
      if (!account || account.provider !== 'github') return true;

      try {
>>>>>>> 52b640f (fix: build errors resolved, production ready)
        const existingUser = await client.fetch(
          `*[_type == "author" && email == $email][0]`,
          { email: user.email }
        );

        if (!existingUser) {
<<<<<<< HEAD
          // Create new author
          await client.create({
            _type: "author",
            name: user.name || "Unknown",
            email: user.email || "",
            image: user.image || "",
            githubId: account.providerAccountId, // ✅ FIXED (type-safe)
=======
          await client.create({
            _type: 'author',
            name: user.name || 'Unknown',
            email: user.email || '',
            image: user.image || '',
            githubId: account.providerAccountId, // ✅ FIXED
>>>>>>> 52b640f (fix: build errors resolved, production ready)
            joinedAt: new Date().toISOString(),
            trusted: false,
          });
        } else {
<<<<<<< HEAD
          // Update avatar if changed
=======
>>>>>>> 52b640f (fix: build errors resolved, production ready)
          if (user.image && existingUser.image !== user.image) {
            await client
              .patch(existingUser._id)
              .set({ image: user.image })
              .commit();
          }
        }
      } catch (error) {
<<<<<<< HEAD
        console.error("NextAuth signIn error:", error);
=======
        console.error('NextAuth signIn error:', error);
>>>>>>> 52b640f (fix: build errors resolved, production ready)
        return false;
      }

      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      try {
        const author = await client.fetch(
          `*[_type == "author" && email == $email][0]{
            _id,
            name,
            email,
            image,
            trusted,
            joinedAt
          }`,
          { email: session.user.email }
        );

        if (author) {
          const postCount = await client.fetch(
            `count(*[_type == "blog" && author == $name])`,
            { name: author.name }
          );

<<<<<<< HEAD
          // Extend session safely
=======
          // ✅ SAFE EXTENSION
>>>>>>> 52b640f (fix: build errors resolved, production ready)
          (session.user as any).id = author._id;
          (session.user as any).trusted = author.trusted;
          (session.user as any).joinedAt = author.joinedAt;
          (session.user as any).postCount = postCount;
        }
      } catch (error) {
<<<<<<< HEAD
        console.error("NextAuth session error:", error);
=======
        console.error('NextAuth session error:', error);
>>>>>>> 52b640f (fix: build errors resolved, production ready)
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
