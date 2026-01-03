import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import TopBar from './TopBar';
import ViewProfile from './ViewProfile';

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/profile/${session.user?.id}`}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'Profile'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </Link>
        <button
          onClick={() => signOut()}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      Sign In
    </button>
  );
}

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">BLOGERS.TO</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8 flex-1 ml-8">
            <Link
              href="/features"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/brand-blogs"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Brand Blogs
            </Link>
            <Link
              href="/affiliates"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Affiliates
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session && <ViewProfile />}
            {!session && (
              <>
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

