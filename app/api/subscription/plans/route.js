export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAllPlans } from '@/lib/subscription';

export async function GET() {
  const plans = getAllPlans();
  return NextResponse.json({ plans });
}
