import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// ===== SECURITY HELPERS =====

// Rate limit store (in-memory, resets on deploy)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = {
  auth: 10,       // 10 auth attempts per minute
  api: 60,        // 60 API calls per minute
  upload: 5,      // 5 uploads per minute
};

function checkRateLimit(ip, type = 'api') {
  const key = `${type}:${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { start: now, count: 1 });
    return true;
  }

  record.count++;
  if (record.count > (MAX_REQUESTS[type] || 60)) {
    return false;
  }
  return true;
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap) {
      if (now - record.start > RATE_LIMIT_WINDOW * 2) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// Block suspicious patterns
const BLOCKED_PATTERNS = [
  /\.\.\//,                    // path traversal
  /<script/i,                  // XSS
  /union\s+select/i,           // SQL injection
  /\$\{.*\}/,                  // template injection
  /eval\s*\(/i,                // code injection
  /javascript:/i,              // XSS via protocol
  /on\w+\s*=/i,                // inline event handlers
  /\x00/,                      // null byte
];

function isMalicious(url) {
  const decoded = decodeURIComponent(url);
  return BLOCKED_PATTERNS.some((p) => p.test(decoded));
}

// Security headers
function addSecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || 'unknown';

    // ===== BLOCK MALICIOUS REQUESTS =====
    if (isMalicious(request.url)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // ===== RATE LIMITING =====
    if (pathname.startsWith('/api/auth')) {
      if (!checkRateLimit(ip, 'auth')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment.' },
          { status: 429 }
        );
      }
    } else if (pathname.startsWith('/api/upload')) {
      if (!checkRateLimit(ip, 'upload')) {
        return NextResponse.json(
          { error: 'Upload limit reached. Try again later.' },
          { status: 429 }
        );
      }
    } else if (pathname.startsWith('/api/')) {
      if (!checkRateLimit(ip, 'api')) {
        return NextResponse.json(
          { error: 'Too many requests. Please slow down.' },
          { status: 429 }
        );
      }
    }

    // ===== ADMIN ROUTES — require admin role =====
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (token?.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/browse', request.url));
      }
    }

    // ===== API BODY SIZE CHECK =====
    // Block unreasonably large request bodies (except upload)
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/upload')) {
      const contentLength = request.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 1024 * 1024) {
        // > 1MB for non-upload API
        return NextResponse.json({ error: 'Request too large' }, { status: 413 });
      }
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ===== PUBLIC ROUTES (no login needed) =====

        // Landing page
        if (pathname === '/') return true;

        // Auth pages
        if (pathname.startsWith('/auth')) return true;
        if (pathname.startsWith('/login') || pathname.startsWith('/register')) return true;

        // Browsing pages — public so users can see content, search, trailers
        if (pathname === '/home' || pathname === '/browse') return true;
        if (pathname === '/movies' || pathname === '/series') return true;
        if (pathname.startsWith('/content/')) return true;
        if (pathname.startsWith('/watch/')) return true;
        if (pathname.startsWith('/movie/')) return true;
        if (pathname.startsWith('/series/')) return true;
        if (pathname === '/search') return true;
        if (pathname === '/subscription' || pathname === '/subscribe') return true;

        // API auth routes
        if (pathname.startsWith('/api/auth')) return true;

        // Public API routes (read content, plans)
        if (pathname.startsWith('/api/content') && req.method === 'GET') return true;
        if (pathname.startsWith('/api/subscription/plans')) return true;

        // Payment callback routes (SSLCommerz posts here)
        if (pathname.startsWith('/api/payment/success') ||
            pathname.startsWith('/api/payment/fail') ||
            pathname.startsWith('/api/payment/cancel') ||
            pathname.startsWith('/api/payment/ipn')) return true;

        // ===== PROTECTED ROUTES (login required) =====
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|avatars).*)',
  ],
};
