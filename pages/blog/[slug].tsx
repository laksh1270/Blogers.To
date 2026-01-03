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

interface BlogDetailProps {
  blog: BlogPost;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ FIX: include commentsEnabled in editForm
  const [editForm, setEditForm] = useState({
    title: blog.title,
    excerpt: blog.excerpt || '',
    author: blog.author || '',
    commentsEnabled: blog.commentsEnabled ?? true,
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

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
              required
            />

            <textarea
              className="w-full mb-4 p-2 border rounded"
              rows={3}
              value={editForm.excerpt}
              onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
            />

            <input
              className="w-full mb-4 p-2 border rounded"
              value={editForm.author}
              onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
            />

            <label className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={editForm.commentsEnabled}
                onChange={(e) =>
                  setEditForm({ ...editForm, commentsEnabled: e.target.checked })
                }
              />
              Enable Comments
            </label>

            <button className="px-6 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/">← Back</Link>

        <h1 className="text-4xl font-bold mt-6">{blog.title}</h1>

        <article className="mt-10 bg-white p-8 rounded">
          <PortableText value={blog.content} />

          {/* ✅ Safe usage */}
          <Comments
            blogId={blog._id}
            commentsEnabled={blog.commentsEnabled !== false}
          />
        </article>

        <BlogSidebar blog={blog} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(allBlogSlugsQuery);

  return {
    paths: slugs.map((s: any) => ({ params: { slug: s.slug.current } })),
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
