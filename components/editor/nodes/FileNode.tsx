'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { File, Download, FileCode, FileSpreadsheet, FileImage, FileVideo, FileAudio, FileText } from 'lucide-react';
import { formatFileSize } from '@/lib/upload/config';

const getFileIcon = (type: string, name: string) => {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.startsWith('audio/')) return FileAudio;
  if (type.includes('pdf')) return FileText;
  if (type.includes('spreadsheet') || name.match(/\.(xlsx?|csv)$/i)) return FileSpreadsheet;
  if (type.includes('javascript') || type.includes('json') || name.match(/\.(js|ts|tsx|jsx|py|json|html|css)$/i)) return FileCode;
  return File;
};

const getFileColor = (type: string, name: string) => {
  if (type.startsWith('image/')) return 'text-green-400 bg-green-500/20';
  if (type.startsWith('video/')) return 'text-purple-400 bg-purple-500/20';
  if (type.startsWith('audio/')) return 'text-yellow-400 bg-yellow-500/20';
  if (type.includes('pdf')) return 'text-red-400 bg-red-500/20';
  if (type.includes('spreadsheet') || name.match(/\.(xlsx?|csv)$/i)) return 'text-emerald-400 bg-emerald-500/20';
  if (name.match(/\.(js|ts|tsx|jsx|py|json|html|css)$/i)) return 'text-blue-400 bg-blue-500/20';
  return 'text-zinc-400 bg-zinc-500/20';
};

const FileComponent = ({ node, selected }: NodeViewProps) => {
  const { src, name, size, type } = node.attrs as { src: string; name: string; size: number; type: string };
  const IconComponent = getFileIcon(type, name);
  const colorClass = getFileColor(type, name);

  return (
    <NodeViewWrapper className="my-4">
      <div className={`inline-flex items-center gap-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="text-sm text-zinc-200 truncate max-w-[200px]">{name}</div>
          <div className="text-xs text-zinc-500">{formatFileSize(size)}</div>
        </div>

        <a
          href={src}
          download={name}
          className="p-2 rounded hover:bg-zinc-700 transition"
          title="Download"
        >
          <Download className="w-4 h-4 text-zinc-400" />
        </a>
      </div>
    </NodeViewWrapper>
  );
};

export const FileNode = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      name: { default: 'file' },
      size: { default: 0 },
      type: { default: 'application/octet-stream' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="file"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'file' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileComponent);
  },
});
