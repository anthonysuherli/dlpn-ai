'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';

const AlignLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

const AlignCenterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const AlignRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" />
  </svg>
);

const ImageComponent = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const [, setIsResizing] = useState(false);
  const { src, alt, title, width, alignment = 'center' } = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    alignment?: 'left' | 'center' | 'right';
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <NodeViewWrapper className="my-4">
      <figure className={`relative ${alignmentClasses[alignment]}`} style={{ width: width || 'auto', maxWidth: '100%' }}>
        <img
          src={src}
          alt={alt || ''}
          title={title || ''}
          className={`rounded-lg ${selected ? 'ring-2 ring-blue-500' : ''}`}
          style={{ width: '100%', height: 'auto' }}
          draggable={false}
        />

        {selected && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-zinc-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => updateAttributes({ alignment: 'left' })}
              className={`p-1.5 rounded ${alignment === 'left' ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}
              title="Align left"
            >
              <AlignLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateAttributes({ alignment: 'center' })}
              className={`p-1.5 rounded ${alignment === 'center' ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}
              title="Align center"
            >
              <AlignCenterIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateAttributes({ alignment: 'right' })}
              className={`p-1.5 rounded ${alignment === 'right' ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}
              title="Align right"
            >
              <AlignRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {selected && (
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
              const startX = e.clientX;
              const startWidth = width || e.currentTarget.parentElement?.offsetWidth || 400;

              const onMouseMove = (e: MouseEvent) => {
                const newWidth = Math.max(100, startWidth + (e.clientX - startX));
                updateAttributes({ width: newWidth });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />
        )}
      </figure>
    </NodeViewWrapper>
  );
};

export const ImageNode = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      alignment: { default: 'center' },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
