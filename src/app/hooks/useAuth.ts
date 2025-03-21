'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SESSION_TIMEOUT = 3600 * 1000; // 1 hour in milliseconds
const CHECK_INTERVAL = 5000; // Check every 5 seconds

export default function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifySession = () => {
      const user = localStorage.getItem('user');
      const lastLogin = localStorage.getItem('lastLogin');

      if (user && lastLogin) {
        const timePassed = Date.now() - parseInt(lastLogin, 10);

        if (timePassed < SESSION_TIMEOUT) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('lastLogin');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifySession(); // First check immediately

    const interval = setInterval(verifySession, CHECK_INTERVAL); // Re-check every 5s

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    // Redirect only after the first check is done and user is NOT authenticated
    if (isAuthenticated === false) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
