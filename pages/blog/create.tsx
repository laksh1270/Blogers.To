import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ImageUpload from '../../components/ImageUpload';
import Header from '../../components/Header';

export default function CreateBlog() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAssetId, setImageAssetId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: '',
    content: '',
    category: 'tech',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert plain text content to Portable Text format
      const contentBlocks = formData.content
        .split('\n\n')
        .filter((para) => para.trim())
        .map((para) => ({
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: para.trim(),
            },
          ],
          style: 'normal',
        }));

      // If no content, add a default block
      const portableTextContent =
        contentBlocks.length > 0
          ? contentBlocks
          : [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: 'Blog content goes here...',
                  },
                ],
                style: 'normal',
              },
            ];

      const response = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          author: formData.author,
          category: formData.category,
          content: portableTextContent,
          mainImage: imageAssetId ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            },
          } : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the new blog post
        router.push(`/blog/${formData.slug}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-block transition-colors"
        >
          ← Back to Blog List
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Blog Post</h1>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <ImageUpload
            onImageUpload={(url, assetId) => {
              setImageUrl(url);
              setImageAssetId(assetId);
            }}
            currentImage={imageUrl}
          />

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              placeholder="Enter blog title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              placeholder="url-friendly-slug"
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be used in the URL (auto-generated from title)
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Short description of your blog post"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Author name"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="tech">Tech</option>
              <option value="health">Health</option>
              <option value="food">Food</option>
              <option value="education">Education</option>
              <option value="places">Places</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Write your blog content here. Use double line breaks to separate paragraphs."
            />
            <p className="mt-1 text-sm text-gray-500">
              Note: For rich text formatting, edit the post in Sanity Studio after
              creation.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Blog Post'}
            </button>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

