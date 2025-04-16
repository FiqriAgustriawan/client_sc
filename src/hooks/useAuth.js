// hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; 

export function useAuthProtection() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!allowedRoles.includes(user.role)) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard-user');
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading };
}