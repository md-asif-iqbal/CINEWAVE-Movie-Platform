'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cw-bg flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar collapsed={false} onToggle={() => setMobileSidebar(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-cw-bg/95 backdrop-blur-sm border-b border-cw-border px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebar(true)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="text-sm text-cw-text-muted">
            <span className="text-cw-red font-bold">Cine</span>Wave Admin
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
