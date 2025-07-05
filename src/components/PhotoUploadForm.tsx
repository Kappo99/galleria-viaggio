'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

export default function PhotoUploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id ?? null);
    };
    getUser();
  }, []);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(',').map(t => t.trim()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const storagePath = userId ? `user/${userId}/${fileName}` : fileName;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(storagePath, file);

    if (uploadError) {
      alert('Errore upload immagine');
      setLoading(false);
      return;
    }

    // Salva solo storagePath, NON la publicUrl
    const { error: dbError } = await supabase.from('photos').insert([
      {
        user_id: userId,
        title,
        notes,
        tags,
        image_url: storagePath,
      },
    ]);

    if (dbError) {
      alert('Errore salvataggio dati');
    } else {
      setTitle('');
      setNotes('');
      setTags([]);
      setFile(null);
      onUploaded();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded bg-white shadow text-dark">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        required
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Note"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Tag (separati da virgola)"
        value={tags.join(', ')}
        onChange={handleTagChange}
        className="border p-2 rounded"
      />
      <button type="submit" disabled={loading || !userId} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer">
        {loading ? 'Caricamento...' : 'Carica'}
      </button>
    </form>
  );
}
