export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import { sendPaymentFailedEmail } from '@/lib/email';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.formData();
    const data = Object.fromEntries(body);
    const { tran_id } = data;

    if (tran_id) {
      const payment = await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { status: 'failed' },
        { new: true }
      );

      if (payment) {
        const user = await User.findById(payment.userId);
        if (user) {
          sendPaymentFailedEmail(user.email, user.name, payment.amount).catch(console.error);
        }
      }
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
  } catch (error) {
    console.error('Payment fail error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
  }
}
