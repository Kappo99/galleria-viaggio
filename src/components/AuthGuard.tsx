'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Non controllare la sessione sulla pagina di login
    if (pathname === '/login') {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // Facoltativo: ascolta i cambiamenti di autenticazione
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (loading) return null; // oppure uno spinner

  return <>{children}</>;
}
