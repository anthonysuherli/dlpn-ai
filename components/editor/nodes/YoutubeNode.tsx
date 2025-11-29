'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';

const extractYoutubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const YoutubeComponent = ({ node, selected }: NodeViewProps) => {
  const { src, width = 640, height = 360 } = node.attrs as { src: string; width?: number; height?: number };
  const videoId = extractYoutubeId(src);

  if (!videoId) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-center text-zinc-500">
          Invalid YouTube URL
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative rounded-lg overflow-hidden ${selected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ maxWidth: width }}
      >
        <div style={{ paddingBottom: `${(height / width) * 100}%` }} className="relative">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const YoutubeNode = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 640 },
      height: { default: 360 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="youtube"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'youtube' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeComponent);
  },
});
