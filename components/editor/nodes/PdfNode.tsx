'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { FileText, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfComponent = ({ node, selected, updateAttributes }: NodeViewProps) => {
  const { src, title, showPreview = true } = node.attrs as { src: string; title?: string; showPreview?: boolean };
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadError(false);
  };

  const onDocumentLoadError = () => {
    setLoadError(true);
  };

  if (!showPreview || loadError) {
    return (
      <NodeViewWrapper className="my-4">
        <div className={`flex items-center gap-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm text-zinc-200 truncate">{title || 'PDF Document'}</div>
            <div className="text-xs text-zinc-500">PDF Document</div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => updateAttributes({ showPreview: true })}
              className="p-2 rounded hover:bg-zinc-700"
              title="Show preview"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <a
              href={src}
              download={title}
              className="p-2 rounded hover:bg-zinc-700"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className={`rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center gap-3 p-3 border-b border-zinc-700">
          <FileText className="w-5 h-5 text-red-400" />
          <span className="flex-1 text-sm text-zinc-200 truncate">{title || 'PDF Document'}</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => updateAttributes({ showPreview: false })}
              className="p-1.5 rounded hover:bg-zinc-700 text-xs text-zinc-400"
            >
              Collapse
            </button>
            <a
              href={src}
              download={title}
              className="p-1.5 rounded hover:bg-zinc-700"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-zinc-700"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 flex justify-center max-h-[600px] overflow-auto">
          <Document
            file={src}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>

        {numPages > 1 && (
          <div className="flex items-center justify-center gap-4 p-2 border-t border-zinc-700">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="p-1 rounded hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-zinc-400">
              Page {pageNumber} of {numPages}
            </span>

            <button
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              className="p-1 rounded hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const PdfNode = Node.create({
  name: 'pdf',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
      showPreview: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pdf"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pdf' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfComponent);
  },
});
