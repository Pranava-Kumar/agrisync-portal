import { useState, useEffect } from 'react';

interface User {
  uid: string;
  email?: string;
  displayName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication - automatically sign in user
    const timer = setTimeout(() => {
      setUser({
        uid: 'demo-user-123',
        email: 'demo@agrisync-x.com',
        displayName: 'Demo User'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signInAsGuest = async () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        uid: 'guest-user-' + Date.now(),
        displayName: 'Guest User'
      });
      setLoading(false);
    }, 500);
  };

  return { user, loading, signInAsGuest };
}