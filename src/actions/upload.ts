import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadFile(file: File) {
  if (!file) {
    return { success: false, message: 'No file uploaded.' };
  }

  if (!storage) {
    console.error("Firebase storage is not initialized");
    return { success: false, message: "Internal error: Storage not initialized" };
  }

  try {
    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `uploads/${filename}`);

    const snapshot = await uploadBytes(storageRef, file);
    const publicUrl = await getDownloadURL(snapshot.ref);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, message: `Upload failed: ${errorMessage}` };
  }
}
