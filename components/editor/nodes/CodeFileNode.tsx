'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { FileCode, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
  };
  return languageMap[ext] || 'text';
};

const CodeFileComponent = ({ node, selected }: NodeViewProps) => {
  const { content, filename, language } = node.attrs as { content: string; filename: string; language: string };
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const detectedLanguage = language || getLanguageFromFilename(filename);
  const lines = content.split('\n');
  const previewLines = 10;
  const hasMore = lines.length > previewLines;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="my-4">
      <div className={`rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="flex-1 text-sm text-zinc-300 font-mono">{filename}</span>
          <span className="text-xs text-zinc-500">{lines.length} lines</span>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-zinc-700 transition"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded hover:bg-zinc-700 transition"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          )}
        </div>

        <div className={`overflow-auto ${!isExpanded ? 'max-h-[200px]' : 'max-h-[500px]'}`}>
          <SyntaxHighlighter
            language={detectedLanguage}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
          >
            {isExpanded ? content : lines.slice(0, previewLines).join('\n')}
          </SyntaxHighlighter>
        </div>

        {hasMore && !isExpanded && (
          <div className="px-3 py-2 bg-zinc-800/50 border-t border-zinc-700 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Show {lines.length - previewLines} more lines
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const CodeFileNode = Node.create({
  name: 'codeFile',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      content: { default: '' },
      filename: { default: 'code.txt' },
      language: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="code-file"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'code-file' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeFileComponent);
  },
});
