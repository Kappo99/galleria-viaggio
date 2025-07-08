'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { useGlobalToast } from './ToastProvider';
import { MessageType } from '@/types';

export default function PhotoUploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const showToast = useGlobalToast();

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
    if (!files.length) return;
    setLoading(true);

    // 1. Crea il record post
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          title,
          notes,
          tags,
        },
      ])
      .select()
      .single();

    if (postError || !postData) {
      showToast('Errore creazione post', MessageType.ERROR);
      setLoading(false);
      return;
    }

    // 2. Carica tutte le immagini e crea i record photos
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const storagePath = userId ? `user/${userId}/${fileName}` : fileName;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(storagePath, file);

      if (uploadError) {
        showToast('Errore upload immagine: ' + file.name, MessageType.ERROR);
        continue;
      }

      const { error: dbError } = await supabase.from('photos').insert([
        {
          post_id: postData.id,
          image_url: storagePath,
        },
      ]);

      if (dbError) {
        showToast('Errore salvataggio dati per: ' + file.name, MessageType.ERROR);
      }
    }

    setTitle('');
    setNotes('');
    setTags([]);
    setFiles([]);
    setLoading(false);
    onUploaded();
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
        multiple
        onChange={e => setFiles(Array.from(e.target.files || []))}
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
