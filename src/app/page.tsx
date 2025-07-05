'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import PhotoUploadForm from '@/components/PhotoUploadForm';
import { MdAddAPhoto, MdCancel } from 'react-icons/md';

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Genera signed URL per ogni foto
      const signedUrls = await Promise.all(
        data.map(async (photo) => {
          const { data: signedUrlData } = await supabase.storage
            .from('photos')
            .createSignedUrl(photo.image_url, 60 * 60); // 1 ora di validità
          return {
            ...photo,
            signedUrl: signedUrlData?.signedUrl || null,
          };
        })
      );
      setPhotos(signedUrls);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Galleria di viaggio</h1>
      <div className="flex justify-center mb-4">
        <button
          className={`${showForm ? "bg-red-600" : "bg-green-600"} ${showForm ? "hover:bg-red-700" : "hover:bg-green-700"} text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2`}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla caricamento" : "Carica nuova foto"}
          {showForm ? <MdCancel className="text-xl" /> : <MdAddAPhoto className="text-xl" />}
        </button>
      </div>
      {showForm && (
        <PhotoUploadForm onUploaded={() => { setShowForm(false); fetchPhotos(); }} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {photos.map((photo) => (
          <div key={photo.id} className="border rounded shadow p-2 flex flex-col items-center bg-white">
            <img
              src={photo.signedUrl}
              alt={photo.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-dark">{photo.title}</h2>
            <p className="text-sm text-gray-600">{photo.notes}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {photo.tags?.map((tag: string) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
