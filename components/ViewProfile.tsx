import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ViewProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        View Profile
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 p-6">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {session.user?.name || 'Unknown User'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date of Joining:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(session.user?.joinedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Number of Posts:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.postCount || 0}
                </span>
              </div>
              {session.user?.trusted && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-semibold">
                    ✓ Trusted Author
                  </span>
                </div>
              )}
            </div>

            <Link
              href={`/profile/${session.user?.id}`}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              View Full Profile
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

