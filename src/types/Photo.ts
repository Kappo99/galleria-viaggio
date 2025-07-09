export type Photo = {
  id: number;
  image_url: string;
  created_at: string;
  signedUrl?: string;
};

export type PhotoUploadFormData = {
  title: string;
  notes?: string;
  tags?: string;
  files: FileList;
};
