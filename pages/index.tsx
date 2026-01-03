import { GetStaticProps } from "next";
import { useState } from "react";
import Link from "next/link";

import { client } from "../lib/sanity";
import { allBlogsQuery } from "../lib/queries";
import { BlogPost } from "../types/blog";

import Header from "../components/Header";
import CategoryFilters from "../components/CategoryFilters";

interface HomeProps {
  blogs: BlogPost[];
}

export default function Home({ blogs }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const categories = [
    { label: "All", value: "all" },
    { label: "Tech", value: "tech" },
    { label: "Health", value: "health" },
    { label: "Food", value: "food" },
    { label: "Education", value: "education" },
    { label: "Places", value: "places" },
  ];

  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }
    if (sortBy === "popular") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
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
        {/* Categories */}
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
          {["latest", "popular", "oldest"].map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition capitalize ${
                sortBy === sort
                  ? "bg-gray-900 dark:bg-gray-800 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {sort}
            </button>
          ))}
        </div>

        {/* Blog Cards */}
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
                  {/* Image */}
                  {blog.mainImage?.asset?.url && (
                    <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                      <img
                        src={blog.mainImage.asset.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {blog.title}
                  </h2>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || "No description available."}
                  </p>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {blog.author && <span>{blog.author}</span>}
                    {blog.publishedAt && (
                      <span>
                        {" "}
                        •{" "}
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
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
