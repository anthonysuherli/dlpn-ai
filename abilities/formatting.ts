import { Ability } from '@/types/ability';
import { Editor } from '@tiptap/react';

export const formattingAbilities: Ability[] = [
  {
    id: 'bold',
    name: 'Bold',
    description: 'Make selected text bold',
    icon: 'Bold',
    target: 'selection',
    category: 'formatting',
    keybinding: 'mod+b',
    isActive: (editor: Editor) => editor?.isActive('bold') ?? false,
    canExecute: (editor: Editor) => editor?.can().toggleBold() ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  {
    id: 'italic',
    name: 'Italic',
    description: 'Make selected text italic',
    icon: 'Italic',
    target: 'selection',
    category: 'formatting',
    keybinding: 'mod+i',
    isActive: (editor: Editor) => editor?.isActive('italic') ?? false,
    canExecute: (editor: Editor) => editor?.can().toggleItalic() ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleItalic().run();
    },
  },
  {
    id: 'strikethrough',
    name: 'Strikethrough',
    description: 'Add strikethrough to selected text',
    icon: 'Strikethrough',
    target: 'selection',
    category: 'formatting',
    isActive: (editor: Editor) => editor?.isActive('strike') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleStrike().run();
    },
  },
  {
    id: 'code',
    name: 'Inline Code',
    description: 'Format selected text as code',
    icon: 'Code',
    target: 'selection',
    category: 'formatting',
    keybinding: 'mod+e',
    isActive: (editor: Editor) => editor?.isActive('code') ?? false,
    execute: (editor: Editor) => {
      editor.chain().focus().toggleCode().run();
    },
  },
  {
    id: 'clear-formatting',
    name: 'Clear Formatting',
    description: 'Remove all formatting from selected text',
    icon: 'RemoveFormatting',
    target: 'selection',
    category: 'formatting',
    execute: (editor: Editor) => {
      editor.chain().focus().unsetAllMarks().run();
    },
  },
];
