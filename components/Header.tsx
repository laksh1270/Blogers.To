import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import TopBar from './TopBar';
import ViewProfile from './ViewProfile';

function AuthButton() {
  const { data: session } = useSession();

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
      onClick={() => signIn()}
      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      Sign In
    </button>
  );
}

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              BLOGERS.TO
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8 flex-1 ml-8">
            <Link href="/features" className="nav-link">Features</Link>
            <Link href="/faq" className="nav-link">FAQ</Link>
            <Link href="/brand-blogs" className="nav-link">Brand Blogs</Link>
            <Link href="/affiliates" className="nav-link">Affiliates</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* ✅ CREATE POST — ALWAYS VISIBLE */}
            <Link
              href="/blog/create"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Create Post
            </Link>

            {/* Profile (only if logged in) */}
            {session && <ViewProfile />}

            {/* Auth */}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
