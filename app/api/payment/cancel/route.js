export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.formData();
    const data = Object.fromEntries(body);
    const { tran_id } = data;

    if (tran_id) {
      await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { status: 'cancelled' }
      );
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=cancelled`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=cancelled`);
  }
}
