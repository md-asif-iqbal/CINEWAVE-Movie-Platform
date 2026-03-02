'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Film, Users, CreditCard, BarChart3,
  Menu, X, ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/content', icon: Film, label: 'Content' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-cw-bg-secondary border border-cw-border rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-cw-bg-secondary border-r border-cw-border z-50 transition-all duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-cw-border">
          {!collapsed && (
            <Link href="/admin/dashboard" className="text-cw-red font-heading font-extrabold text-lg">
              CINEWAVE
            </Link>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-cw-text-secondary hover:text-white"
          >
            {mobileOpen ? <X size={20} /> : <ChevronLeft size={20} className={cn(collapsed && 'rotate-180')} />}
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {sidebarLinks.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                  active
                    ? 'bg-cw-red/10 text-cw-red'
                    : 'text-cw-text-muted hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Link
            href="/home"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-cw-text-muted hover:text-white hover:bg-white/5 transition-colors min-h-[44px]',
            )}
          >
            <ChevronLeft size={20} className="shrink-0" />
            {!collapsed && <span>Back to App</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
