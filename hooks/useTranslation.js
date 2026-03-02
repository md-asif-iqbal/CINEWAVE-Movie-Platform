'use client';
import translations from '@/lib/translations';

export default function useTranslation() {
  return { t: translations };
}

export { useTranslation };
