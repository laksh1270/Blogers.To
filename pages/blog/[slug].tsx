import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react';
import { client, writeClient } from '../../lib/sanity';
import { blogBySlugQuery, allBlogSlugsQuery } from '../../lib/queries';
import { BlogPost } from '../../types/blog';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Comments from '../../components/Comments';
import BlogSidebar from '../../components/BlogSidebar';

interface BlogDetailProps {
  blog: BlogPost;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: blog.title,
    excerpt: blog.excerpt || '',
    author: blog.author || '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/${blog._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
      setIsDeleting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blog/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          excerpt: editForm.excerpt,
          author: editForm.author,
          commentsEnabled: editForm.commentsEnabled,
        }),
      });

      if (response.ok) {
        router.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <form onSubmit={handleEdit} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={editForm.excerpt}
                onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.commentsEnabled}
                  onChange={(e) => setEditForm({ ...editForm, commentsEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Comments
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isDeleting}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 inline-block transition-colors">
          ← Back to Blog List
        </Link>
        <div className="flex justify-between items-start mt-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {blog.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
                  {blog.category}
                </span>
              )}
              {blog.views !== undefined && (
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {blog.views} views
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {blog.publishedAt && (
                <span>Published: {formatDate(blog.publishedAt)}</span>
              )}
              {blog.author && <span>By {blog.author}</span>}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-gray-800 rounded-lg p-8 md:p-12">
              {blog.mainImage?.asset?.url && (
                <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
                  <img
                    src={blog.mainImage.asset.url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-800 dark:prose-li:text-gray-200">
                <PortableText value={blog.content} />
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <Comments blogId={blog._id} commentsEnabled={blog.commentsEnabled !== false} />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BlogSidebar blog={blog} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(allBlogSlugsQuery);

  const paths = slugs
    .filter((slug: { slug: { current: string } }) => slug.slug?.current)
    .map((slug: { slug: { current: string } }) => ({
      params: { slug: slug.slug.current },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const blog = await client.fetch(blogBySlugQuery, { slug });

  if (!blog) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blog,
    },
    revalidate: 60,
  };
};

