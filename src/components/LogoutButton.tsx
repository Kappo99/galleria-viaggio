'use client';

import { supabase } from '@/supabaseClient';
import { usePathname, useRouter } from 'next/navigation';
import { MdLogout } from 'react-icons/md';

export default function LogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
    >
      Logout <MdLogout className="text-xl" />
    </button>
  );
}
