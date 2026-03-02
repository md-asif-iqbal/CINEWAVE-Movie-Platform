'use client';
import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

export default function AuthTabs({ emailForm, phoneForm }) {
  const [tab, setTab] = useState('email');

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex rounded-lg border-2 border-cw-border overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => setTab('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            tab === 'email'
              ? 'bg-cw-red text-white'
              : 'bg-cw-bg text-cw-text-muted hover:text-white'
          }`}
        >
          <Mail size={16} />
          Email
        </button>
        <button
          type="button"
          onClick={() => setTab('phone')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            tab === 'phone'
              ? 'bg-cw-red text-white'
              : 'bg-cw-bg text-cw-text-muted hover:text-white'
          }`}
        >
          <Phone size={16} />
          Phone
        </button>
      </div>

      {/* Tab content */}
      <div>{tab === 'email' ? emailForm : phoneForm}</div>
    </div>
  );
}
