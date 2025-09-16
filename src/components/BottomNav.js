'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, User, Settings, Users, Target, BookOpen, BarChart3 } from 'lucide-react';

const tabs = [
  { href: '/chat', label: 'Chat', icon: MessageCircle, disabled: false },
  { href: '/profile', label: 'Profile', icon: User, disabled: false },
  { href: '/setting', label: 'Setting', icon: Settings, disabled: false },
  { href: '/community', label: 'Community', icon: Users, disabled: true },
  { href: '/goals', label: 'Goals', icon: Target, disabled: false },
  { href: '/journaling', label: 'Journal', icon: BookOpen, disabled: false },
  { href: '/insights', label: 'Insights', icon: BarChart3, disabled: false },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-gray-200">
      <ul className="grid grid-cols-7">
        {tabs.map(({ href, label, icon: Icon, disabled }) => {
          const active = pathname === href;
          const base = 'flex flex-col items-center justify-center py-2 text-[11px]';
          const classes = active ? 'text-pink-600' : 'text-gray-600';
          return (
            <li key={href}>
              {disabled ? (
                <div className={`${base} ${classes} opacity-40`}>
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </div>
              ) : (
                <Link href={href} className={`${base} ${classes}`}>
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


