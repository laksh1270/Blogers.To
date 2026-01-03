import { GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { client } from '../lib/sanity'
import { allBlogsQuery } from '../lib/queries'
import { BlogPost } from '../types/blog'

import Header from '../components/Header'
import CategoryFilters from '../components/CategoryFilters'

interface HomeProps {
  blogs: BlogPost[]
}

export default function Home({ blogs }: HomeProps) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  // ✅ Prevent hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  if (!mounted) return null

  const filteredBlogs =
    selectedCategory === 'all'
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory)

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    if (sortBy === 'oldest') {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    }
    if (sortBy === 'popular') {
      return (b.views || 0) - (a.views || 0)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Banner */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src="/banner.png"
          alt="Banner"
          className="w-full h-[550px] object-cover"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">

        {/* ✅ CREATE POST BUTTON */}
        {status === 'authenticated' && (
          <div className="flex justify-center mb-10">
            <Link
              href="/blog/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              + Create Post
            </Link>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-8 flex justify-center">
          <CategoryFilters
            categories={[
              { label: 'All', value: 'all' },
              { label: 'Tech', value: 'tech' },
              { label: 'Health', value: 'health' },
              { label: 'Food', value: 'food' },
              { label: 'Education', value: 'education' },
              { label: 'Places', value: 'places' },
            ]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug.current}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition"
            >
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
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {blog.excerpt || 'No description available'}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const blogs = await client.fetch(allBlogsQuery)

  return {
    props: { blogs },
    revalidate: 60,
  }
}
