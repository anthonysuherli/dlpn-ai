export const UPLOAD_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  allowedDocumentTypes: ['application/pdf'],
  allowedCodeExtensions: ['.js', '.ts', '.tsx', '.jsx', '.py', '.json', '.html', '.css', '.md', '.yaml', '.yml', '.sql', '.sh', '.bash'],
};

export type FileCategory = 'image' | 'video' | 'audio' | 'pdf' | 'code' | 'file';

export function getFileCategory(file: File): FileCategory {
  const { allowedImageTypes, allowedVideoTypes, allowedAudioTypes, allowedDocumentTypes, allowedCodeExtensions } = UPLOAD_CONFIG;

  if (allowedImageTypes.includes(file.type)) return 'image';
  if (allowedVideoTypes.includes(file.type)) return 'video';
  if (allowedAudioTypes.includes(file.type)) return 'audio';
  if (allowedDocumentTypes.includes(file.type)) return 'pdf';

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (allowedCodeExtensions.includes(extension)) return 'code';

  return 'file';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}