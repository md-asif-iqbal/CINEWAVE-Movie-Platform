export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';

// Sanitize strings to prevent XSS
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
}

function sanitizeObj(obj) {
  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      clean[key] = sanitize(val);
    } else if (Array.isArray(val)) {
      clean[key] = val.map((v) => (typeof v === 'string' ? sanitize(v) : v));
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Math.min(100, parseInt(searchParams.get('page') || '1')));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '20')));
    const search = sanitize(searchParams.get('search') || '');
    const type = sanitize(searchParams.get('type') || '');

    const query = {};
    if (type && ['movie', 'series', 'documentary', 'short'].includes(type)) {
      query.type = type;
    }
    if (search) {
      // Escape regex special chars to prevent ReDoS
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { director: { $regex: escaped, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [contents, total] = await Promise.all([
      Content.find(query).sort('-createdAt').skip(skip).limit(limit).lean(),
      Content.countDocuments(query),
    ]);

    return NextResponse.json({
      contents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const rawData = await request.json();

    // Validate required fields
    if (!rawData.title || typeof rawData.title !== 'string' || rawData.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!rawData.type || !['movie', 'series', 'documentary', 'short'].includes(rawData.type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }
    if (!rawData.description || rawData.description.length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }

    // Sanitize all string fields
    const data = sanitizeObj(rawData);

    const content = await Content.create(data);
    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
