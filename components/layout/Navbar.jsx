"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import useAuthStore from '@/store/authStore';
import useTranslation from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const activeProfile = useAuthStore((s) => s.activeProfile);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/home', label: t.home },
    { href: '/browse', label: t.browse },
    { href: '/my-list', label: t.myList },
  ];

  if (session?.user?.role === 'admin') {
    navLinks.push({ href: '/admin/dashboard', label: t.admin });
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-cw-bg/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <nav className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/home" className="text-cw-red font-heading font-extrabold text-xl md:text-2xl tracking-wider">
              CINEWAVE
            </Link>

            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-white',
                    pathname === link.href ? 'text-white' : 'text-cw-text-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search, Language, Bell, Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/search"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-white text-cw-text-muted transition-colors"
              aria-label={t.search}
            >
              <Search size={20} />
            </Link>

            <button className="hidden md:flex min-w-[44px] min-h-[44px] items-center justify-center hover:text-white text-cw-text-muted transition-colors">
              <Bell size={20} />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <Avatar
                    src={activeProfile?.avatar || session.user?.image}
                    name={activeProfile?.name || session.user?.name}
                    size="sm"
                  />
                  <ChevronDown
                    size={16}
                    className={cn(
                      'hidden md:block text-cw-text-secondary transition-transform',
                      profileOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-cw-bg-secondary border border-cw-border rounded-lg shadow-xl overflow-hidden"
                      onClick={() => setProfileOpen(false)}
                    >
                      <div className="p-3 border-b border-cw-border">
                        <p className="text-sm font-medium text-white truncate">
                          {activeProfile?.name || session.user?.name}
                        </p>
                        <p className="text-xs text-cw-text-secondary truncate">{session.user?.email}</p>
                      </div>
                      <Link href="/profiles" className="block px-4 py-2.5 text-sm text-cw-text-muted hover:bg-white/10 hover:text-white">
                        {t.switchProfile}
                      </Link>
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-cw-text-muted hover:bg-white/10 hover:text-white">
                        {t.accountSettings}
                      </Link>
                      <Link href="/subscribe" className="block px-4 py-2.5 text-sm text-cw-text-muted hover:bg-white/10 hover:text-white">
                        {t.subscription}
                      </Link>
                      <hr className="border-cw-border" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2.5 text-sm text-cw-text-muted hover:bg-white/10 hover:text-white"
                      >
                        {t.signOut}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-cw-red hover:bg-cw-red-hover text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                {t.signIn}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-cw-bg border-t border-cw-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center px-3 py-3 rounded text-sm font-medium transition-colors min-h-[44px]',
                    pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-cw-text-muted hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
