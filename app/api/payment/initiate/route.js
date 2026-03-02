export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import { initiatePayment } from '@/lib/sslcommerz';
import { getPlanDetails } from '@/lib/subscription';
import { generateTransactionId } from '@/lib/utils';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { plan } = await request.json();

    const planDetails = getPlanDetails(plan);
    if (!planDetails) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const transactionId = generateTransactionId();

    // Save pending payment
    await Payment.create({
      userId: session.user.id,
      transactionId,
      amount: planDetails.price,
      currency: 'BDT',
      plan,
      status: 'pending',
    });

    const paymentData = {
      total_amount: planDetails.price,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.NEXTAUTH_URL}/api/payment/success`,
      fail_url: `${process.env.NEXTAUTH_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXTAUTH_URL}/api/payment/ipn`,
      cus_name: session.user.name || 'Customer',
      cus_email: session.user.email,
      cus_phone: '01700000000',
      product_name: `CineWave ${planDetails.label}`,
      product_category: 'Subscription',
      product_profile: 'non-physical-goods',
      shipping_method: 'NO',
    };

    const result = await initiatePayment(paymentData);

    if (result.GatewayPageURL) {
      await Payment.findOneAndUpdate(
        { transactionId },
        { sslSessionKey: result.sessionkey }
      );
      return NextResponse.json({ url: result.GatewayPageURL });
    }

    return NextResponse.json({ error: 'Failed to initiate payment.' }, { status: 500 });
  } catch (error) {
    console.error('Payment initiate error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
