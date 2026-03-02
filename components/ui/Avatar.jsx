'use client';
import Image from 'next/image';
import { cn, getInitials, getAvatarUrl } from '@/lib/utils';

export default function Avatar({ src, name, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  if (src && src !== '/avatars/default.png') {
    return (
      <div className={cn('relative rounded-md overflow-hidden', sizes[size], className)}>
        <Image src={getAvatarUrl(src)} alt={name || 'Avatar'} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-md bg-cw-bg-card flex items-center justify-center font-semibold text-white',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
