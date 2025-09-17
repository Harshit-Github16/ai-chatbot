'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // This effect runs once when the component mounts.
    // It's a good place to put redirection logic.
    router.push('/chat');
  }, [router]); // The router dependency ensures this doesn't create an infinite loop.

  return (
    <div>
      <p>Redirecting you to the chat page...</p>
    </div>
  );
}