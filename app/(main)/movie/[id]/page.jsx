import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function MovieDetailPage({ params }) {
  redirect(`/content/${params.id}`);
}
