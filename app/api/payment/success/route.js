export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';
import { validatePayment } from '@/lib/sslcommerz';
import { calculateEndDate } from '@/lib/subscription';
import { sendPaymentSuccessEmail } from '@/lib/email';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.formData();
    const data = Object.fromEntries(body);

    const { tran_id, val_id, amount, bank_tran_id, card_type, status } = data;

    if (status !== 'VALID') {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
    }

    // Validate with SSLCommerz
    const validation = await validatePayment(val_id);
    if (!validation || validation.status !== 'VALID') {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
    }

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
    }

    // Update payment
    payment.status = 'completed';
    payment.sslValId = val_id;
    payment.bankTransactionId = bank_tran_id;
    payment.cardType = card_type;
    await payment.save();

    // Create or extend subscription
    const existingSub = await Subscription.findOne({
      userId: payment.userId,
      status: 'active',
      endDate: { $gt: new Date() },
    });

    const startDate = existingSub ? existingSub.endDate : new Date();
    const endDate = calculateEndDate(startDate, payment.plan);

    if (existingSub) {
      existingSub.endDate = endDate;
      existingSub.plan = payment.plan;
      await existingSub.save();
    } else {
      await Subscription.create({
        userId: payment.userId,
        plan: payment.plan,
        status: 'active',
        startDate,
        endDate,
        amount: payment.amount,
        paymentId: payment._id,
      });
    }

    // Send confirmation email
    const user = await User.findById(payment.userId);
    if (user) {
      sendPaymentSuccessEmail(user.email, user.name, payment.amount, payment.plan).catch(console.error);
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=success`);
  } catch (error) {
    console.error('Payment success error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/subscription?status=failed`);
  }
}
