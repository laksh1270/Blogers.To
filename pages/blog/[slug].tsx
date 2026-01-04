import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { client } from '../../lib/sanity';
import { blogBySlugQuery, allBlogSlugsQuery } from '../../lib/queries';
import { BlogPost } from '../../types/blog';

import Header from '../../components/Header';
import Comments from '../../components/Comments';
import BlogSidebar from '../../components/BlogSidebar';

interface BlogDetailProps {
  blog: BlogPost;
}

type EditForm = {
  title: string;
  excerpt: string;
  author: string;
  commentsEnabled: boolean;
};

export default function BlogDetail({ blog }: BlogDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState<EditForm>({
    title: blog.title,
    excerpt: blog.excerpt || '',
    author: blog.author || '',
    commentsEnabled: blog.commentsEnabled !== false,
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/${blog._id}`, { method: 'DELETE' });
      if (res.ok) router.push('/');
      else setIsDeleting(false);
    } catch {
      setIsDeleting(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) router.reload();
      else setIsDeleting(false);
    } catch {
      setIsDeleting(false);
    }
  };

  /* ================= CATEGORY COLOR ================= */
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      education: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      places: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  /* ================= VIEW MODE ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline inline-block mb-6"
        >
          ← Back to Blog List
        </Link>

        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            {blog.category && (
              <span
                className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                  blog.category
                )}`}
              >
                {blog.category}
              </span>
            )}

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {blog.publishedAt && formatDate(blog.publishedAt)}
              {blog.author && ` • ${blog.author}`}
            </p>
          </div>

          {session && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN ARTICLE */}
          <article className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 shadow-sm">
            {blog.mainImage?.asset?.url && (
              <div className="relative h-96 w-full overflow-hidden rounded-lg mb-10">
                <img
                  src={blog.mainImage.asset.url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={blog.content} />
            </div>

            <div className="mt-16">
              <Comments
                blogId={blog._id}
                commentsEnabled={blog.commentsEnabled !== false}
              />
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogSidebar blog={blog} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ================= SSG ================= */

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(allBlogSlugsQuery);

  const paths = slugs.map((s: any) => ({
    params: { slug: s.slug.current },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blog = await client.fetch(blogBySlugQuery, {
    slug: params?.slug,
  });

  if (!blog) return { notFound: true };

  return {
    props: { blog },
    revalidate: 60,
  };
};
