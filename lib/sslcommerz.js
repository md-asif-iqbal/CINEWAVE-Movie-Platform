import SSLCommerzPayment from 'sslcommerz-lts';
import { getPlanDetails } from './subscription';

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export async function initiatePayment({
  userId,
  userEmail,
  userName,
  userPhone,
  plan,
  amount,
  transactionId,
}) {
  const planDetails = getPlanDetails(plan);

  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`,
    ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/ipn`,
    shipping_method: 'No',
    product_name: `CineWave ${planDetails?.name || plan} Plan`,
    product_category: 'Subscription',
    product_profile: 'non-physical-goods',
    cus_name: userName || 'Customer',
    cus_email: userEmail,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: userPhone || '01700000000',
    value_a: userId,
    value_b: plan,
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);
  return apiResponse;
}

export async function validatePayment(val_id) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  return await sslcz.validate({ val_id });
}
