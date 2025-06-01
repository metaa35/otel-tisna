export async function uploadToCloudinary(file: File): Promise<string | null> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const form = new FormData();
  form.append('file', new Blob([buffer]), file.name);
  form.append('upload_preset', 'default');

  const res = await fetch('https://api.cloudinary.com/v1_1/df770zzfr/image/upload', {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return data.secure_url || null;
} 