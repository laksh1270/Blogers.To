import Link from 'next/link';
import { BlogPost } from '../types/blog';

interface BlogSidebarProps {
  blog: BlogPost;
}

export default function BlogSidebar({ blog }: BlogSidebarProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract headings from content for table of contents
  const extractHeadings = (content: any[]) => {
    const headings: string[] = [];
    content.forEach((block: any) => {
      if (block._type === 'block' && block.style && ['h1', 'h2', 'h3'].includes(block.style)) {
        const text = block.children
          ?.map((child: any) => child.text)
          .join('') || '';
        if (text) headings.push(text);
      }
    });
    return headings;
  };

  const headings = extractHeadings(blog.content || []);

  return (
    <div className="space-y-6">
      {/* CTA Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
          Reach Inbox Zero in Minutes
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center leading-relaxed">
          Let AI handle your emails, unsubscribe from newsletters, and block unwanted messages.
        </p>
        <button className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
          Try Blogers.to
        </button>
      </div>

      {/* Written by */}
      {blog.author && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Written by</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">{blog.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">@{blog.author.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {headings.map((heading, index) => (
              <li key={index}>
                <a
                  href={`#heading-${index}`}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

