'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-cw-red hover:bg-cw-red-hover text-white shadow-md shadow-cw-red/20',
      secondary: 'bg-cw-bg-card hover:bg-gray-600 text-white border-2 border-[#555]',
      outline: 'border-2 border-[#555] bg-transparent hover:bg-cw-bg-card hover:border-white/70 text-white',
      ghost: 'bg-transparent hover:bg-white/10 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cw-red/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
