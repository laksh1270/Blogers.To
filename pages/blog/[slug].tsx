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

/* ✅ Proper EditForm type */
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

  /* ================= EDIT MODE ================= */
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <form onSubmit={handleEdit} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>

            <input
              className="w-full mb-4 p-2 border rounded"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Title"
              required
            />

            <textarea
              className="w-full mb-4 p-2 border rounded"
              value={editForm.excerpt}
              onChange={(e) =>
                setEditForm({ ...editForm, excerpt: e.target.value })
              }
              placeholder="Excerpt"
            />

            <input
              className="w-full mb-4 p-2 border rounded"
              value={editForm.author}
              onChange={(e) =>
                setEditForm({ ...editForm, author: e.target.value })
              }
              placeholder="Author"
            />

            <label className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={editForm.commentsEnabled}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    commentsEnabled: e.target.checked,
                  })
                }
              />
              Enable comments
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ================= VIEW MODE ================= */

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      tech: 'bg-blue-100 text-blue-800',
      health: 'bg-green-100 text-green-800',
      food: 'bg-orange-100 text-orange-800',
      education: 'bg-purple-100 text-purple-800',
      places: 'bg-pink-100 text-pink-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Blog List
        </Link>

        <div className="flex justify-between mt-6">
          <div>
            {blog.category && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                  blog.category
                )}`}
              >
                {blog.category}
              </span>
            )}

            <h1 className="text-4xl font-bold mt-4">{blog.title}</h1>

            <p className="text-sm text-gray-600 mt-2">
              {blog.publishedAt && formatDate(blog.publishedAt)}
              {blog.author && ` • ${blog.author}`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 bg-white p-8 rounded-lg">
          {blog.mainImage?.asset?.url && (
            <img
              src={blog.mainImage.asset.url}
              alt={blog.title}
              className="w-full h-96 object-cover rounded mb-8"
            />
          )}

          <PortableText value={blog.content} />

          <div className="mt-12">
            <Comments
              blogId={blog._id}
              commentsEnabled={blog.commentsEnabled !== false}
            />
          </div>
        </article>

        <div className="lg:col-span-1">
          <BlogSidebar blog={blog} />
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
