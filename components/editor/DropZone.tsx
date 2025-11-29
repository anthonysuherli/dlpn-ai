'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { processFile, readTextFile } from '@/lib/upload/storage';
import { getFileCategory, UPLOAD_CONFIG, formatFileSize } from '@/lib/upload/config';

interface DropZoneProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export function DropZone({ editor, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    if (!editor) return;

    for (const file of files) {
      try {
        if (file.size > UPLOAD_CONFIG.maxFileSize) {
          setError(`File "${file.name}" is too large. Maximum size is ${formatFileSize(UPLOAD_CONFIG.maxFileSize)}.`);
          continue;
        }

        setUploadProgress({ name: file.name, progress: 0 });

        const category = getFileCategory(file);
        const stored = await processFile(file);

        setUploadProgress({ name: file.name, progress: 100 });

        switch (category) {
          case 'image':
            editor.chain().focus().insertContent({
              type: 'customImage',
              attrs: { src: stored.dataUrl, alt: stored.name, title: stored.name },
            }).run();
            break;

          case 'video':
            editor.chain().focus().insertContent({
              type: 'video',
              attrs: { src: stored.dataUrl, title: stored.name },
            }).run();
            break;

          case 'audio':
            editor.chain().focus().insertContent({
              type: 'audio',
              attrs: { src: stored.dataUrl, title: stored.name },
            }).run();
            break;

          case 'pdf':
            editor.chain().focus().insertContent({
              type: 'pdf',
              attrs: { src: stored.dataUrl, title: stored.name },
            }).run();
            break;

          case 'code':
            const content = await readTextFile(file);
            editor.chain().focus().insertContent({
              type: 'codeFile',
              attrs: { content, filename: stored.name },
            }).run();
            break;

          default:
            editor.chain().focus().insertContent({
              type: 'fileAttachment',
              attrs: {
                src: stored.dataUrl,
                name: stored.name,
                size: stored.size,
                type: stored.type,
              },
            }).run();
        }

        setTimeout(() => setUploadProgress(null), 500);

      } catch (err) {
        console.error('Upload error:', err);
        setError(`Failed to upload "${file.name}"`);
        setUploadProgress(null);
      }
    }
  }, [editor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="relative h-full">
      <input {...getInputProps()} />

      {children}

      {(isDragActive || isDragging) && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-lg text-blue-400 font-medium">Drop files here</p>
            <p className="text-sm text-blue-400/70">Images, videos, PDFs, code files, and more</p>
          </div>
        </div>
      )}

      {uploadProgress && (
        <div className="absolute bottom-4 right-4 bg-zinc-800 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-sm text-zinc-300 truncate">{uploadProgress.name}</span>
          </div>
          <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 right-4 bg-red-900/90 rounded-lg shadow-lg p-3 max-w-[300px] z-50 flex items-start gap-2">
          <span className="text-sm text-red-200 flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
