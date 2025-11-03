'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function ConditionalBottomNav() {
    const pathname = usePathname();

    // Hide BottomNav on these pages
    const hideNavPages = ['/landing', '/login'];

    if (hideNavPages.includes(pathname)) {
        return null;
    }

    return <BottomNav />;
}