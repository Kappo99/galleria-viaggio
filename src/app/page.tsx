'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import PhotoUploadForm from '@/components/PhotoUploadForm';
import { MdAddAPhoto, MdCancel, MdDelete } from 'react-icons/md';
import Image from 'next/image';
import type { Post } from '@/types/Post';
import type { Photo } from '@/types/Photo';
import useConfirm from '@/components/useConfirm';
import { useGlobalToast } from '@/components/ToastProvider';
import { MessageType } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [confirm, ConfirmDialog] = useConfirm();
  
  const showToast = useGlobalToast();

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
          (post.photos || []).map(async (photo: Photo) => {
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

  const handleDeletePost = async (post: Post) => {
    const ok = await confirm("Sei sicuro di voler eliminare questo post e tutte le sue foto?");
    if (!ok) return;

    // 1. Elimina tutte le immagini dallo storage
    const imagePaths = post.photos.map((photo: Photo) => photo.image_url);
    if (imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove(imagePaths);
      if (storageError) {
        showToast("Errore durante l'eliminazione delle immagini dallo storage", MessageType.ERROR);
        return;
      }
    }

    // 2. Elimina le foto dal database
    const { error: photosError } = await supabase
      .from('photos')
      .delete()
      .eq('post_id', post.id);
    if (photosError) {
      showToast("Errore durante l'eliminazione delle foto dal database", MessageType.ERROR);
      return;
    }

    // 3. Elimina il post dal database
    const { error: postError } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);
    if (postError) {
      showToast("Errore durante l'eliminazione del post", MessageType.ERROR);
      return;
    }

    // 4. Aggiorna la lista dei post
    fetchPostsWithPhotos();
  };

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
          <div key={post.id} className="relative p-4 border rounded bg-white shadow">
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs mb-2 cursor-pointer"
              onClick={() => handleDeletePost(post)}
            >
              <MdDelete className='text-lg' />
            </button>
            <h2 className="text-xl font-bold text-dark">{post.title}</h2>
            <p className="text-gray-600">{post.notes}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {post.photos.map((photo: Photo) => (
                <Image
                  key={photo.id}
                  src={photo.signedUrl ?? ''}
                  alt={post.title}
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover rounded aspect-square"
                  unoptimized
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {ConfirmDialog}
    </div>
  );
}
