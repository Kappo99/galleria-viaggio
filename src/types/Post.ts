import type { Photo } from './Photo';

export type Post = {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  tags: string[];
  created_at: string;
  photos: Photo[];
};
