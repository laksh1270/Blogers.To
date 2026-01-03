import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import TopBar from './TopBar';
import ViewProfile from './ViewProfile';

function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      Sign In
    </button>
  );
}

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          BLOGERS.TO
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link href="/features">Features</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/brand-blogs">Brand Blogs</Link>
          <Link href="/affiliates">Affiliates</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* ✅ CREATE POST BUTTON (NOW GUARANTEED TO SHOW) */}
          {status === 'authenticated' && (
            <Link
              href="/blog/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Create Post
            </Link>
          )}

          {status === 'authenticated' && <ViewProfile />}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
