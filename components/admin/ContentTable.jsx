'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ContentTable({ items = [], onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cw-border text-left">
            <th className="p-3 text-cw-text-secondary font-medium">Content</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden md:table-cell">Type</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden lg:table-cell">Genre</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden md:table-cell">Status</th>
            <th className="p-3 text-cw-text-secondary font-medium hidden sm:table-cell">Views</th>
            <th className="p-3 text-cw-text-secondary font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b border-cw-border/50 hover:bg-cw-bg-card/30">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 aspect-video rounded overflow-hidden bg-cw-bg-card shrink-0">
                    {item.thumbnailUrl ? (
                      <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-cw-text-secondary">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{item.title}</p>
                    <p className="text-xs text-cw-text-secondary">{item.year}</p>
                  </div>
                </div>
              </td>
              <td className="p-3 hidden md:table-cell">
                <Badge variant="outline">{item.type}</Badge>
              </td>
              <td className="p-3 hidden lg:table-cell text-cw-text-muted">
                {item.genre?.slice(0, 2).join(', ')}
              </td>
              <td className="p-3 hidden md:table-cell">
                <Badge variant={item.status === 'active' ? 'green' : item.status === 'coming_soon' ? 'yellow' : 'default'}>
                  {item.status}
                </Badge>
              </td>
              <td className="p-3 hidden sm:table-cell text-cw-text-muted">{item.views || 0}</td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Link href={`/admin/content/edit/${item._id}`}>
                    <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px]">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-w-[36px] min-h-[36px] text-red-400"
                    onClick={() => onDelete?.(item._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className="text-center py-8 text-cw-text-secondary">No content found</p>
      )}
    </div>
  );
}
