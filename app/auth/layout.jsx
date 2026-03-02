export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
