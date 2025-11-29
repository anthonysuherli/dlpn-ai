'use client';

import { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Image, File, Youtube, Plus, X } from 'lucide-react';
import { processFile, readTextFile } from '@/lib/upload/storage';
import { getFileCategory } from '@/lib/upload/config';

interface MediaToolbarProps {
  editor: Editor | null;
}

export function MediaToolbar({ editor }: MediaToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState<'youtube' | 'image' | null>(null);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const category = getFileCategory(file);
      const stored = await processFile(file);

      switch (category) {
        case 'image':
          editor.chain().focus().insertContent({
            type: 'customImage',
            attrs: { src: stored.dataUrl, alt: stored.name },
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
            attrs: { src: stored.dataUrl, name: stored.name, size: stored.size, type: stored.type },
          }).run();
      }
    }

    setShowMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) return;

    if (showUrlInput === 'youtube') {
      editor.chain().focus().insertContent({
        type: 'youtube',
        attrs: { src: url },
      }).run();
    } else if (showUrlInput === 'image') {
      editor.chain().focus().insertContent({
        type: 'customImage',
        attrs: { src: url },
      }).run();
    }

    setUrl('');
    setShowUrlInput(null);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.js,.ts,.tsx,.jsx,.py,.json,.html,.css,.md"
      />

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-zinc-700 transition"
        title="Insert media"
      >
        {showMenu ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 py-2 min-w-[200px] z-50">
          {showUrlInput && (
            <div className="px-3 py-2 border-b border-zinc-700">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={showUrlInput === 'youtube' ? 'YouTube URL' : 'Image URL'}
                  className="flex-1 px-2 py-1 bg-zinc-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  autoFocus
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-2 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-700 transition text-left"
          >
            <File className="w-4 h-4 text-zinc-400" />
            <span className="text-sm">Upload file</span>
          </button>

          <button
            onClick={() => setShowUrlInput(showUrlInput === 'image' ? null : 'image')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-700 transition text-left"
          >
            <Image className="w-4 h-4 text-green-400" />
            <span className="text-sm">Image from URL</span>
          </button>

          <button
            onClick={() => setShowUrlInput(showUrlInput === 'youtube' ? null : 'youtube')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-700 transition text-left"
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span className="text-sm">YouTube video</span>
          </button>

          <div className="border-t border-zinc-700 my-1" />

          <div className="px-3 py-1.5">
            <span className="text-xs text-zinc-500">Or drag & drop files into editor</span>
          </div>
        </div>
      )}
    </div>
  );
}
