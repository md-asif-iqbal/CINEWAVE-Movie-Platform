'use client';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const navigation = [
    { label: 'Home', href: '/home' },
    { label: 'Browse', href: '/browse' },
    { label: 'Movies', href: '/movies' },
    { label: 'Series', href: '/series' },
    { label: 'My List', href: '/my-list' },
    { label: 'New & Popular', href: '/browse' },
  ];

  const categories = [
    { label: 'Action', href: '/browse?genre=Action' },
    { label: 'Comedy', href: '/browse?genre=Comedy' },
    { label: 'Drama', href: '/browse?genre=Drama' },
    { label: 'Thriller', href: '/browse?genre=Thriller' },
    { label: 'Romance', href: '/browse?genre=Romance' },
    { label: 'Sci-Fi', href: '/browse?genre=Sci-Fi' },
    { label: 'Horror', href: '/browse?genre=Horror' },
    { label: 'Documentary', href: '/browse?genre=Documentary' },
  ];

  const support = [
    { label: 'FAQ', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Account', href: '/account' },
    { label: 'Subscription Plans', href: '/subscription' },
    { label: 'Contact Us', href: '#' },
    { label: 'Manage Profiles', href: '/profiles' },
  ];

  const legal = [
    { label: 'Terms of Use', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Preferences', href: '#' },
    { label: 'Corporate Information', href: '#' },
    { label: 'Legal Notices', href: '#' },
  ];

  const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-cw-bg border-t border-cw-border/50 mt-12 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-10 pb-8">
        {/* Social Links */}
        <div className="flex items-center gap-4 mb-8">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-cw-text-secondary hover:text-white transition-colors"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Navigation</h3>
            <ul className="space-y-2">
              {navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cw-text-secondary hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cw-text-secondary hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2">
              {support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cw-text-secondary hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cw-text-secondary hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service Code Button */}
        <button className="text-[13px] text-cw-text-secondary border border-cw-text-secondary/50 px-3 py-1.5 mb-6 hover:text-white hover:border-white transition-colors">
          Service Code
        </button>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-cw-border/30">
          <Link href="/" className="text-cw-red font-heading font-extrabold text-xl tracking-wider">
            CINEWAVE
          </Link>
          <p className="text-xs text-cw-text-secondary/70">
            &copy; {new Date().getFullYear()} CineWave. All rights reserved. Developed by{' '}
            <a
              href="https://github.com/md-asif-iqbal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cw-red hover:text-white transition-colors font-medium"
            >
              Asif Iqbal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
