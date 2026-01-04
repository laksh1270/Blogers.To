import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { client } from "../../../lib/sanity";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
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
      if (!account || account.provider !== "github") return true;

      try {
        const existingUser = await client.fetch(
          `*[_type == "author" && email == $email][0]`,
          { email: user.email }
        );

        if (!existingUser) {
          await client.create({
            _type: "author",
            name: user.name || "Unknown",
            email: user.email || "",
            image: user.image || "",
            githubId: account.providerAccountId,
            joinedAt: new Date().toISOString(),
            trusted: false,
          });
        } else if (user.image && existingUser.image !== user.image) {
          await client
            .patch(existingUser._id)
            .set({ image: user.image })
            .commit();
        }
      } catch (error) {
        console.error("NextAuth signIn error:", error);
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

          (session.user as any).id = author._id;
          (session.user as any).trusted = author.trusted;
          (session.user as any).joinedAt = author.joinedAt;
          (session.user as any).postCount = postCount;
        }
      } catch (error) {
        console.error("NextAuth session error:", error);
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
