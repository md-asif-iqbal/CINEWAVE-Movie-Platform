'use client';
import { cn } from '@/lib/utils';

export default function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse bg-cw-bg-card rounded', className)} />
  );
}
