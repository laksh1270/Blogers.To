import { GetStaticProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { client } from '../lib/sanity';
import { allBlogsQuery } from '../lib/queries';
import { BlogPost } from '../types/blog';
import Header from '../components/Header';
import CategoryFilters from '../components/CategoryFilters';

interface HomeProps {
  blogs: BlogPost[];
}

export default function Home({ blogs }: HomeProps) {
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

  // Filter by category
  let filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    } else if (sortBy === 'popular') {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      education: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      places: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  // Get featured posts (first 3)
  const featuredPosts = sortedBlogs.slice(0, 3);
  const regularPosts = sortedBlogs.slice(3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Website Banner - Full Width */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src="/banner.png"
          alt="Banner"
          className="w-[9999px] h-[550px]"
          
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Category Filters - Hidden by default, can be toggled */}
        <div className="mb-8 flex justify-center">
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Sort Filters - Compact */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <div className="flex gap-2">
            {['latest', 'popular', 'oldest'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  sortBy === sort
                    ? 'bg-gray-900 dark:bg-gray-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        {sortedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No blog posts yet.</p>
            <Link
              href="/blog/create"
              className="inline-block px-6 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="glow-border"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="glow-border-content p-6 shadow-lg">
                  <Link
                    href={`/blog/${blog.slug.current}`}
                    className="group block"
                  >
                  {/* Blog Image */}
                  {blog.mainImage?.asset?.url ? (
                    <div className="relative h-64 overflow-hidden rounded-lg mb-4 bg-gray-200">
                      <img
                        src={blog.mainImage.asset.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="relative h-64 overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Blog Content */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h2>
                    {blog.excerpt ? (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                        A short excerpt describing the content appears here.
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {blog.author && (
                        <span>{blog.author}</span>
                      )}
                      {blog.publishedAt && (
                        <>
                          <span className="text-gray-400 dark:text-gray-500">•</span>
                          <span>{formatDate(blog.publishedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  </Link>
                </div>
              </div>
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
    props: {
      blogs,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

