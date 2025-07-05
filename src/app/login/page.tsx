'use client';

import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';

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
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {isLogin ? 'Login' : 'Registrati'}
        </button>
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Login'}
        </button>
      </form>
    </div>
  );
}
