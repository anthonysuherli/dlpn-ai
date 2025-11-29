import { Editor } from '@tiptap/react';

export type TargetType =
  | 'selection'
  | 'word'
  | 'paragraph'
  | 'block'
  | 'input:string'
  | 'input:file'
  | 'document'
  | 'none';

export type AbilityCategory =
  | 'formatting'
  | 'structure'
  | 'insert'
  | 'navigation'
  | 'ai'
  | 'custom';

export interface Ability {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: TargetType;
  category: AbilityCategory;
  keybinding?: string;
  cooldown?: number;
  isActive?: (editor: Editor) => boolean;
  execute: (editor: Editor, input?: string | File) => void;
  canExecute?: (editor: Editor) => boolean;
}
