'use client';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PaymentStatusCard({ status, title, message, details, children }) {
  const icons = {
    success: <CheckCircle size={64} className="text-green-500" />,
    failed: <XCircle size={64} className="text-red-500" />,
    cancelled: <AlertCircle size={64} className="text-cw-text-secondary" />,
  };

  const bgColors = {
    success: 'border-green-800/50',
    failed: 'border-red-800/50',
    cancelled: 'border-cw-border',
  };

  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center p-4">
      <div className={cn('max-w-md w-full bg-cw-bg-secondary rounded-lg border p-8 text-center', bgColors[status])}>
        <div className="flex justify-center mb-4">{icons[status]}</div>
        <h1 className="text-fluid-xl font-heading font-bold text-white mb-2">{title}</h1>
        <p className="text-cw-text-muted text-sm mb-6">{message}</p>

        {details && (
          <div className="bg-cw-bg rounded-lg p-4 mb-6 text-left space-y-2">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-cw-text-secondary">{key}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
