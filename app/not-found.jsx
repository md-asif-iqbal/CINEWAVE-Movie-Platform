import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-8xl font-black text-cw-red mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-cw-text-secondary mb-8 text-sm sm:text-base">
          The page you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex bg-cw-red hover:bg-cw-red-hover text-white font-medium px-6 py-3 rounded-md transition-colors min-h-[44px] items-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
