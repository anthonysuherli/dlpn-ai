import { v4 as uuidv4 } from 'uuid';

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  createdAt: number;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processFile(file: File): Promise<StoredFile> {
  const dataUrl = await fileToDataUrl(file);

  return {
    id: uuidv4(),
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl,
    createdAt: Date.now(),
  };
}

export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
