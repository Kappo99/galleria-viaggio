'use client';

import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push('/');
    } else {
      // Registrazione
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        alert('Registrazione avvenuta! Controlla la tua email per confermare.');
        setIsLogin(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // oppure una pagina specifica dopo il login
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Registrati'}</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer">
          {isLogin ? 'Login' : 'Registrati'}
        </button>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Login'}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-white hover:bg-slate-200 text-dark border-dark p-2 rounded-full mt-2 cursor-pointer flex items-center justify-center gap-6"
        >
          <Image src="/google.png" alt="Google" width={24} height={24} className="w-6 h-6" />
          Accedi con Google
        </button>
      </form>
    </div>
  );
}
