'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl sm:text-5xl font-black text-cw-red mb-4">Error!</h1>
        <p className="text-cw-text-secondary mb-6 text-sm sm:text-base">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-cw-red hover:bg-cw-red-hover text-white font-medium px-6 py-3 rounded-md transition-colors min-h-[44px]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
