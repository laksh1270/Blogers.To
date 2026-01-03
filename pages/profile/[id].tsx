import { GetStaticProps, GetStaticPaths } from 'next';
import { useSession } from 'next-auth/react';
import { client } from '../../lib/sanity';
import Header from '../../components/Header';

interface Author {
  _id: string;
  name: string;
  email: string;
  image?: {
    asset: {
      url: string;
    };
  };
  trusted: boolean;
  joinedAt: string;
}

interface ProfileProps {
  author: Author;
  blogs: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    mainImage?: {
      asset: { url: string };
    };
  }>;
}

export default function Profile({ author, blogs }: ProfileProps) {
  const { data: session } = useSession();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOwnProfile = session?.user?.id === author._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {author.image?.asset?.url ? (
                <img
                  src={author.image.asset.url}
                  alt={author.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200 dark:border-gray-700">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
              {author.trusted && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {author.name}
                </h1>
                {author.trusted ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                    ✓ Trusted Author
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-semibold">
                    Author
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{author.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {formatDate(author.joinedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Blogs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Posts by {author.name} ({blogs.length})
          </h2>

          {blogs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <a
                  key={blog._id}
                  href={`/blog/${blog.slug.current}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {blog.mainImage?.asset?.url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.mainImage.asset.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(blog.publishedAt)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const authors = await client.fetch(`*[_type == "author"] { _id }`);
  
  const paths = authors.map((author: { _id: string }) => ({
    params: { id: author._id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;

  const author = await client.fetch(
    `*[_type == "author" && _id == $id][0] {
      _id,
      name,
      email,
      image {
        asset-> {
          url
        }
      },
      trusted,
      joinedAt
    }`,
    { id }
  );

  if (!author) {
    return {
      notFound: true,
    };
  }

  const blogs = await client.fetch(
    `*[_type == "blog" && author == $authorName] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      mainImage {
        asset-> {
          url
        }
      }
    }`,
    { authorName: author.name }
  );

  return {
    props: {
      author,
      blogs,
    },
    revalidate: 60,
  };
};

