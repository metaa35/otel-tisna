export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'default');
  const res = await fetch('https://api.cloudinary.com/v1_1/df770zzfr/image/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url || null;
} 