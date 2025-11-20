"use server";

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function saveFileLocally(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, message: 'No file uploaded.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const publicUploadsPath = join(process.cwd(), 'public', 'uploads');
  const filePath = join(publicUploadsPath, filename);

  // Ensure the uploads directory exists
  await mkdir(publicUploadsPath, { recursive: true });

  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/${filename}`;
  return { success: true, url: publicUrl };
}
