export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';
import { validatePayment } from '@/lib/sslcommerz';
import { calculateEndDate } from '@/lib/subscription';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.formData();
    const data = Object.fromEntries(body);
    const { tran_id, val_id, status } = data;

    if (status !== 'VALID') {
      return NextResponse.json({ message: 'IPN: Invalid status' });
    }

    const validation = await validatePayment(val_id);
    if (!validation || validation.status !== 'VALID') {
      return NextResponse.json({ message: 'IPN: Validation failed' });
    }

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment || payment.status === 'completed') {
      return NextResponse.json({ message: 'IPN: Already processed or not found' });
    }

    payment.status = 'completed';
    payment.sslValId = val_id;
    payment.ipnResponse = data;
    await payment.save();

    // Check subscription exists
    const existingSub = await Subscription.findOne({
      userId: payment.userId,
      status: 'active',
      endDate: { $gt: new Date() },
    });

    if (!existingSub) {
      const startDate = new Date();
      const endDate = calculateEndDate(startDate, payment.plan);
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

    return NextResponse.json({ message: 'IPN processed' });
  } catch (error) {
    console.error('IPN error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
