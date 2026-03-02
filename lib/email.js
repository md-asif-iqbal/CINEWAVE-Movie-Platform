import nodemailer from 'nodemailer';

// Only create transporter if email credentials are configured
const isEmailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const baseStyle = `
  body { margin: 0; padding: 0; background-color: #141414; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .logo { font-size: 28px; font-weight: 800; color: #E50914; text-decoration: none; letter-spacing: 1px; }
  .card { background: #181818; border-radius: 8px; padding: 32px; margin: 24px 0; border: 1px solid #333; }
  .btn { display: inline-block; padding: 14px 32px; background: #E50914; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; }
  .btn:hover { background: #F40612; }
  .text-muted { color: #808080; font-size: 14px; }
  .text-white { color: #ffffff; }
  .divider { border: none; border-top: 1px solid #333; margin: 24px 0; }
  h1 { font-size: 24px; margin: 0 0 16px 0; }
  h2 { font-size: 20px; margin: 0 0 12px 0; }
  p { line-height: 1.6; margin: 8px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
  .badge { display: inline-block; padding: 4px 12px; background: #E50914; border-radius: 4px; font-size: 12px; font-weight: 600; }
  .green { color: #22c55e; }
  .footer { text-align: center; padding: 24px 0; color: #808080; font-size: 12px; }
`;

function emailTemplate(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyle}</style></head>
    <body>
      <div class="container">
        <div style="text-align: center; padding: 20px 0;">
          <span class="logo">CINEWAVE</span>
        </div>
        <div class="card">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CineWave. All rights reserved.</p>
          <p>This email was sent by CineWave streaming platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendMail(to, subject, html) {
  if (!transporter) {
    console.log(`[Email skipped] No email config. Would send "${subject}" to ${to}`);
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'CineWave <noreply@cinewave.com>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendWelcomeEmail(user) {
  const trialEnd = new Date(user.trialEndDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const html = emailTemplate(`
    <h1>Welcome to CineWave! 🎬</h1>
    <p>Dear ${user.name},</p>
    <p>Your account has been successfully created. You can enjoy all content <strong>free for 2 months</strong>!</p>
    <hr class="divider">
    <p><strong>Free trial ends:</strong> ${trialEnd}</p>
    <p><strong>Benefits:</strong></p>
    <ul>
      <li>Watch all movies and series</li>
      <li>HD 1080p quality</li>
      <li>Watch on all devices</li>
      <li>No ads</li>
    </ul>
    <hr class="divider">
    ${user.emailVerificationToken ? `<p style="text-align: center;"><a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.emailVerificationToken}" class="btn">Verify Email</a></p>` : ''}
    <p class="text-muted">Start watching and enjoy CineWave!</p>
  `);
  return sendMail(user.email, 'Welcome to CineWave! Enjoy 2 months free 🎬', html);
}

export async function sendVerificationEmail(user) {
  const html = emailTemplate(`
    <h1>Email Verification</h1>
    <p>Dear ${user.name},</p>
    <p>Click the button below to verify your email address:</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.emailVerificationToken}" class="btn">Verify Email</a>
    </p>
    <p class="text-muted">This link is valid for 24 hours.</p>
    <p class="text-muted">If you did not make this request, please ignore this email.</p>
  `);
  return sendMail(user.email, 'CineWave — Verify Your Email', html);
}

export async function sendTrialExpiringEmail(user, daysLeft) {
  const urgency = daysLeft <= 1;
  const html = emailTemplate(`
    <h1>${urgency ? '⚠️ Your free trial ends tomorrow' : `Your free trial ends in ${daysLeft} days`}</h1>
    <p>Dear ${user.name},</p>
    <p>${urgency
      ? 'Your free trial ends tomorrow. Subscribe now so you can keep watching your favorite content!'
      : `Your free trial ends in ${daysLeft} days. Subscribe and enjoy uninterrupted entertainment.`
    }</p>
    <hr class="divider">
    <h2>Our Plans:</h2>
    <table width="100%" cellpadding="8" style="color: #fff;">
      <tr style="border-bottom: 1px solid #333;">
        <td>Monthly</td><td>৳20/month</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td>6 Months <span class="badge">Popular</span></td><td>৳100</td>
      </tr>
      <tr>
        <td>Yearly <span class="badge">Best Value</span></td><td>৳200</td>
      </tr>
    </table>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe" class="btn">Subscribe Now</a>
    </p>
  `);
  return sendMail(
    user.email,
    urgency
      ? 'CineWave — Your free trial ends tomorrow!'
      : `CineWave — Your free trial ends in ${daysLeft} days`,
    html
  );
}

export async function sendTrialExpiredEmail(user) {
  const html = emailTemplate(`
    <h1>Your Free Trial Has Ended</h1>
    <p>Dear ${user.name},</p>
    <p>Your 2-month free trial has ended. Choose a subscription plan to continue watching content on CineWave.</p>
    <hr class="divider">
    <h2>Plan Comparison:</h2>
    <table width="100%" cellpadding="12" style="color: #fff;">
      <tr style="background: #2F2F2F; border-radius: 4px;">
        <td><strong>Monthly</strong><br>৳20/month</td>
        <td><strong>6 Months</strong><br>৳100 (Save ৳20)</td>
        <td><strong>Yearly</strong><br>৳200 (Save ৳40)</td>
      </tr>
    </table>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe" class="btn">Subscribe Now</a>
    </p>
  `);
  return sendMail(user.email, 'CineWave — Your free trial has ended — Subscribe now', html);
}

export async function sendPaymentSuccessEmail(user, payment, subscription) {
  const validUntil = new Date(subscription.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const html = emailTemplate(`
    <h1>Payment Successful — Thank you! 🎉</h1>
    <p>Dear ${user.name},</p>
    <p>Your payment has been completed successfully.</p>
    <hr class="divider">
    <table width="100%" cellpadding="8" style="color: #fff;">
      <tr style="border-bottom: 1px solid #333;"><td class="text-muted">Transaction ID</td><td>${payment.transactionId}</td></tr>
      <tr style="border-bottom: 1px solid #333;"><td class="text-muted">Plan</td><td>${subscription.plan}</td></tr>
      <tr style="border-bottom: 1px solid #333;"><td class="text-muted">Amount</td><td>৳${payment.amount}</td></tr>
      <tr style="border-bottom: 1px solid #333;"><td class="text-muted">Payment Method</td><td>${payment.paymentMethod || 'N/A'}</td></tr>
      <tr><td class="text-muted">Valid Until</td><td class="green">${validUntil}</td></tr>
    </table>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/home" class="btn">Start Watching</a>
    </p>
  `);
  return sendMail(user.email, 'CineWave — Payment Successful! Thank you 🎉', html);
}

export async function sendPaymentFailedEmail(user) {
  const html = emailTemplate(`
    <h1>Payment Failed</h1>
    <p>Dear ${user.name},</p>
    <p>Your payment could not be completed. Please try again.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe" class="btn">Try Again</a>
    </p>
    <p class="text-muted">If you continue to experience issues, please contact us.</p>
  `);
  return sendMail(user.email, 'CineWave — Payment Failed', html);
}

export async function sendSubscriptionExpiringEmail(user, subscription, daysLeft) {
  const html = emailTemplate(`
    <h1>Your subscription ends in ${daysLeft} days</h1>
    <p>Dear ${user.name},</p>
    <p>Your ${subscription.plan} plan ends in ${daysLeft} days. Renew and enjoy uninterrupted entertainment.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe" class="btn">Renew Now</a>
    </p>
  `);
  return sendMail(user.email, `CineWave — Subscription ends in ${daysLeft} days`, html);
}

export async function sendPasswordResetEmail(user) {
  const html = emailTemplate(`
    <h1>Password Reset</h1>
    <p>Dear ${user.name},</p>
    <p>Click the button below to reset your password:</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${user.passwordResetToken}" class="btn">Reset Password</a>
    </p>
    <p class="text-muted">This link is valid for 1 hour.</p>
    <p class="text-muted">If you did not make this request, please ignore this email.</p>
  `);
  return sendMail(user.email, 'CineWave — Password Reset', html);
}
