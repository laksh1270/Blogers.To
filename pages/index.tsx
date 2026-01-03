import { GetStaticProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { client } from '../lib/sanity';
import { allBlogsQuery } from '../lib/queries';
import { BlogPost } from '../types/blog';

import Header from '../components/Header';
import CategoryFilters from '../components/CategoryFilters';

interface HomeProps {
  blogs: BlogPost[];
}

export default function Home({ blogs }: HomeProps) {
  const { data: session } = useSession();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Tech', value: 'tech' },
    { label: 'Health', value: 'health' },
    { label: 'Food', value: 'food' },
    { label: 'Education', value: 'education' },
    { label: 'Places', value: 'places' },
  ];

  // Filter blogs
  const filteredBlogs =
    selectedCategory === 'all'
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }
    if (sortBy === 'popular') {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Banner */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src="/banner.png"
          alt="Banner"
          className="w-[9999px] h-[550px] object-cover"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ✅ CREATE POST BUTTON (FIXED) */}
        {session && (
          <div className="flex justify-center mb-10">
            <Link
              href="/blog/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              + Create Post
            </Link>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-8 flex justify-center">
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </span>
          {['latest', 'popular', 'oldest'].map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition ${
                sortBy === sort
                  ? 'bg-gray-900 dark:bg-gray-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {sortedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No blog posts yet.
            </p>
            {session && (
              <Link
                href="/blog/create"
                className="inline-block px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug.current}`}
                className="group block"
              >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition">
                  {blog.mainImage?.asset?.url && (
                    <img
                      src={blog.mainImage.asset.url}
                      alt={blog.title}
                      className="h-56 w-full object-cover rounded mb-4"
                    />
                  )}

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || 'No description available.'}
                  </p>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {blog.author && <span>{blog.author}</span>}
                    {blog.publishedAt && (
                      <span> • {formatDate(blog.publishedAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const blogs = await client.fetch(allBlogsQuery);

  return {
    props: { blogs },
    revalidate: 60,
  };
};
