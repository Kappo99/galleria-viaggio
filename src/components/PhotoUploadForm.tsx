'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { useGlobalToast } from './ToastProvider';
import { MessageType } from '@/types';
import { useForm } from "react-hook-form";
import type { PhotoUploadFormData } from '@/types/Photo';

export default function PhotoUploadForm({ onUploaded }: { onUploaded: () => void }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<PhotoUploadFormData>();
  const [userId, setUserId] = useState<string | null>(null);
  
  const showToast = useGlobalToast();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id ?? null);
    };
    getUser();
  }, []);

  const onSubmit = async (data: PhotoUploadFormData) => {
    // Gestione files
    const files = Array.from(data.files as FileList);
    if (!files.length) {
      return;
    }
    // Gestione tags
    const tags = (data.tags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    // 1. Crea il record post
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          title: data.title,
          notes: data.notes,
          tags,
        },
      ])
      .select()
      .single();

    if (postError || !postData) {
      showToast('Errore creazione post', MessageType.ERROR);
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

    reset();
    onUploaded();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-4 border rounded bg-white shadow text-dark">
      <input {...register("title", { required: true })} placeholder="Titolo" className="border p-2 rounded" />
      <input {...register("files", { required: true })} type="file" multiple className="border p-2 rounded" />
      <textarea {...register("notes")} placeholder="Note" className="border p-2 rounded" />
      <input {...register("tags")} placeholder="Tag (separati da virgola)" className="border p-2 rounded" />
      <button type="submit" disabled={isSubmitting || !userId} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer">
        {isSubmitting ? 'Caricamento...' : 'Carica'}
      </button>
    </form>
  );
}
