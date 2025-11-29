import { Ability } from '@/types/ability';
import { Editor } from '@tiptap/react';

export const structureAbilities: Ability[] = [
  {
    id: 'heading-1',
    name: 'Heading 1',
    description: 'Convert paragraph to large heading',
    icon: 'Heading1',
    target: 'paragraph',
    category: 'structure',
    keybinding: 'mod+alt+1',
    isActive: (editor: Editor) => editor?.isActive('heading', { level: 1 }) ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    description: 'Convert paragraph to medium heading',
    icon: 'Heading2',
    target: 'paragraph',
    category: 'structure',
    keybinding: 'mod+alt+2',
    isActive: (editor: Editor) => editor?.isActive('heading', { level: 2 }) ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    id: 'heading-3',
    name: 'Heading 3',
    description: 'Convert paragraph to small heading',
    icon: 'Heading3',
    target: 'paragraph',
    category: 'structure',
    keybinding: 'mod+alt+3',
    isActive: (editor: Editor) => editor?.isActive('heading', { level: 3 }) ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    id: 'bullet-list',
    name: 'Bullet List',
    description: 'Create a bulleted list',
    icon: 'List',
    target: 'paragraph',
    category: 'structure',
    isActive: (editor: Editor) => editor?.isActive('bulletList') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    id: 'ordered-list',
    name: 'Numbered List',
    description: 'Create a numbered list',
    icon: 'ListOrdered',
    target: 'paragraph',
    category: 'structure',
    isActive: (editor: Editor) => editor?.isActive('orderedList') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    id: 'blockquote',
    name: 'Quote',
    description: 'Format as a blockquote',
    icon: 'Quote',
    target: 'paragraph',
    category: 'structure',
    isActive: (editor: Editor) => editor?.isActive('blockquote') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    id: 'code-block',
    name: 'Code Block',
    description: 'Create a code block',
    icon: 'FileCode',
    target: 'paragraph',
    category: 'structure',
    isActive: (editor: Editor) => editor?.isActive('codeBlock') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    id: 'horizontal-rule',
    name: 'Divider',
    description: 'Insert a horizontal divider',
    icon: 'Minus',
    target: 'none',
    category: 'structure',
    execute: (editor: Editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
];
