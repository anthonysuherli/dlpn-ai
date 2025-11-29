"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";
import {
  ImageNode,
  VideoNode,
  AudioNode,
  FileNode,
  CodeFileNode,
  YoutubeNode,
} from "./editor/nodes";
import { DropZone } from "./editor/DropZone";
import { processFile, readTextFile } from "@/lib/upload/storage";
import { getFileCategory } from "@/lib/upload/config";

interface EditorProps {
  content: string;
  onUpdate: (stats: {
    words: number;
    chars: number;
    lines: number;
    col: number;
  }) => void;
  onContentChange: (content: string, isDirty: boolean) => void;
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
    .replace(/\n/gim, "<br>")
    .replace(/<br><h/gim, "<h")
    .replace(/<\/h(\d)><br>/gim, "</h$1>")
    .replace(/<br><li>/gim, "<li>")
    .replace(/<\/li><br>/gim, "</li>");
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
    .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
    .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function Editor({ content, onUpdate, onContentChange }: EditorProps) {
  const { setEditor } = useEditorStore();
  const initialContentRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  const handlePastedFile = useCallback(async (file: File, editorInstance: ReturnType<typeof useEditor>) => {
    if (!editorInstance) return;

    const category = getFileCategory(file);
    const stored = await processFile(file);

    switch (category) {
      case 'image':
        editorInstance.chain().focus().insertContent({
          type: 'customImage',
          attrs: { src: stored.dataUrl, alt: stored.name, title: stored.name },
        }).run();
        break;
      case 'video':
        editorInstance.chain().focus().insertContent({
          type: 'video',
          attrs: { src: stored.dataUrl, title: stored.name },
        }).run();
        break;
      case 'audio':
        editorInstance.chain().focus().insertContent({
          type: 'audio',
          attrs: { src: stored.dataUrl, title: stored.name },
        }).run();
        break;
      case 'pdf':
        editorInstance.chain().focus().insertContent({
          type: 'pdf',
          attrs: { src: stored.dataUrl, title: stored.name },
        }).run();
        break;
      case 'code':
        const content = await readTextFile(file);
        editorInstance.chain().focus().insertContent({
          type: 'codeFile',
          attrs: { content, filename: stored.name },
        }).run();
        break;
      default:
        editorInstance.chain().focus().insertContent({
          type: 'fileAttachment',
          attrs: { src: stored.dataUrl, name: stored.name, size: stored.size, type: stored.type },
        }).run();
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      ImageNode,
      VideoNode,
      AudioNode,
      FileNode,
      CodeFileNode,
      YoutubeNode,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/') || item.type.startsWith('video/') || item.type.startsWith('audio/')) {
            const file = item.getAsFile();
            if (file) {
              handlePastedFile(file, editor);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;

      const { from } = editor.state.selection;

      let lineCount = 1;
      let col = from;

      editor.state.doc.nodesBetween(0, from, (node, pos) => {
        if (node.isBlock && pos < from) {
          lineCount++;
          col = from - pos - 1;
        }
      });

      onUpdate({ words, chars, lines: lineCount, col: col + 1 });

      if (!isLoadingRef.current) {
        const currentHtml = editor.getHTML();
        const markdown = htmlToMarkdown(currentHtml);
        const isDirty = markdown !== initialContentRef.current;
        onContentChange(markdown, isDirty);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;

      const { from } = editor.state.selection;

      let lineCount = 1;
      let col = from;

      editor.state.doc.nodesBetween(0, from, (node, pos) => {
        if (node.isBlock && pos < from) {
          lineCount++;
          col = from - pos - 1;
        }
      });

      onUpdate({ words, chars, lines: lineCount, col: col + 1 });
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      isLoadingRef.current = true;
      initialContentRef.current = content;
      const html = markdownToHtml(content);
      editor.commands.setContent(html);
      onContentChange(content, false);
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 0);
    }
  }, [editor, content, onContentChange]);

  useEffect(() => {
    if (editor) {
      setEditor(editor);
      onUpdate({ words: 0, chars: 0, lines: 1, col: 1 });
    }
    return () => {
      setEditor(null);
    };
  }, [editor, onUpdate, setEditor]);

  return (
    <DropZone editor={editor}>
      <EditorContent editor={editor} className="h-full" />
    </DropZone>
  );
}

export function resetDirtyState(newContent: string, ref: React.MutableRefObject<string>) {
  ref.current = newContent;
}
