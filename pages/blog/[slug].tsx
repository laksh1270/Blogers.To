import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react';
import { client } from '../../lib/sanity';
import { blogBySlugQuery, allBlogSlugsQuery } from '../../lib/queries';
import { BlogPost } from '../../types/blog';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Comments from '../../components/Comments';
import BlogSidebar from '../../components/BlogSidebar';
import { useSession } from 'next-auth/react';

interface BlogDetailProps {
  blog: BlogPost;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: blog.title,
    excerpt: blog.excerpt || '',
    author: blog.author || '',
    commentsEnabled: blog.commentsEnabled ?? true,
  });

  /* ================= PERMISSION CHECK (FIXED) ================= */
  const canEdit =
    !!session?.user?.email &&
    !!blog.authorEmail &&
    session.user.email === blog.authorEmail;

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <form
            onSubmit={handleEdit}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Edit Blog Post
            </h2>

            <input
              className="w-full mb-4 p-2 border rounded dark:bg-gray-700"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              required
            />

            <textarea
              className="w-full mb-4 p-2 border rounded dark:bg-gray-700"
              rows={3}
              value={editForm.excerpt}
              onChange={(e) =>
                setEditForm({ ...editForm, excerpt: e.target.value })
              }
            />

            <input
              className="w-full mb-4 p-2 border rounded dark:bg-gray-700"
              value={editForm.author}
              onChange={(e) =>
                setEditForm({ ...editForm, author: e.target.value })
              }
            />

            <label className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300">
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
              Enable Comments
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-400 rounded"
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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Blogs
        </Link>

        <div className="flex justify-between items-start mt-6">
          <h1 className="text-4xl font-bold text-white">{blog.title}</h1>

          {/* ✅ EDIT / DELETE NOW WORK */}
          {canEdit && (
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
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <article className="mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg">
          {blog.mainImage?.asset?.url && (
            <img
              src={blog.mainImage.asset.url}
              alt={blog.title}
              className="rounded mb-8"
            />
          )}

          <div className="prose dark:prose-invert max-w-none">
            <PortableText value={blog.content} />
          </div>

          <div className="mt-12">
            <Comments
              blogId={blog._id}
              commentsEnabled={blog.commentsEnabled !== false}
            />
          </div>
        </article>

        <div className="mt-10">
          <BlogSidebar blog={blog} />
        </div>
      </div>
    </div>
  );
}

/* ================= SSG ================= */

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(allBlogSlugsQuery);

  return {
    paths: slugs.map((s: any) => ({
      params: { slug: s.slug.current },
    })),
    fallback: 'blocking',
  };
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
