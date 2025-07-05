'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import PhotoUploadForm from '@/components/PhotoUploadForm';
import { MdAddAPhoto, MdCancel } from 'react-icons/md';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchPostsWithPhotos = async () => {
    const { data, error } = await supabase
      .from('posts_with_photos')
      .select('*');

    if (error) {
      // gestisci errore
      return;
    }

    // Genera signed URL per ogni foto
    const postsWithSignedPhotos = await Promise.all(
      (data || []).map(async (post) => {
        const photos = await Promise.all(
          (post.photos || []).map(async (photo: any) => {
            const { data: signedUrlData } = await supabase.storage
              .from('photos')
              .createSignedUrl(photo.image_url, 60 * 60);
            return {
              ...photo,
              signedUrl: signedUrlData?.signedUrl || null,
            };
          })
        );
        return {
          ...post,
          photos,
        };
      })
    );

    setPosts(postsWithSignedPhotos);
  };

  useEffect(() => {
    fetchPostsWithPhotos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Galleria di viaggio</h1>
      <div className="flex justify-center mb-4">
        <button
          className={`${showForm ? "bg-red-600" : "bg-green-600"} ${showForm ? "hover:bg-red-700" : "hover:bg-green-700"} text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2`}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla" : "Nuovo post"}
          {showForm ? <MdCancel className="text-xl" /> : <MdAddAPhoto className="text-xl" />}
        </button>
      </div>
      {showForm && (
        <PhotoUploadForm onUploaded={() => { setShowForm(false); fetchPostsWithPhotos(); }} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 mb-8">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-bold text-dark">{post.title}</h2>
            <p className="text-gray-600">{post.notes}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.photos.map((photo: any) => (
                <img
                  key={photo.id}
                  src={photo.signedUrl}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
