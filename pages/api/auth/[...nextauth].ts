import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { client } from '../../../lib/sanity';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        try {
          // Check if user exists in Sanity
          const existingUser = await client.fetch(
            `*[_type == "author" && email == $email][0]`,
            { email: user.email }
          );

          if (!existingUser) {
            // Create new author in Sanity
            await client.create({
              _type: 'author',
              name: user.name || profile?.name || 'Unknown',
              email: user.email || '',
              image: user.image || '',
              githubId: profile?.id?.toString() || account.providerAccountId,
              joinedAt: new Date().toISOString(),
              trusted: false,
            });
          } else {
            // Update image if changed
            if (user.image && existingUser.image !== user.image) {
              await client
                .patch(existingUser._id)
                .set({ image: user.image })
                .commit();
            }
          }
        } catch (error) {
          console.error('Error creating/updating user:', error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const author = await client.fetch(
            `*[_type == "author" && email == $email][0] {
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
            // Get post count
            const postCount = await client.fetch(
              `count(*[_type == "blog" && author == $authorName])`,
              { authorName: author.name }
            );

            session.user.id = author._id;
            session.user.trusted = author.trusted;
            session.user.joinedAt = author.joinedAt;
            session.user.postCount = postCount;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);


