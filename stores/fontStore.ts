import { create } from 'zustand';

export const AVAILABLE_FONTS = [
  { id: 'fira-code', name: 'Fira Code', value: '"Fira Code", monospace' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { id: 'source-code-pro', name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
  { id: 'inter', name: 'Inter', value: '"Inter", sans-serif' },
  { id: 'roboto', name: 'Roboto', value: '"Roboto", sans-serif' },
  { id: 'open-sans', name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { id: 'lora', name: 'Lora', value: '"Lora", serif' },
  { id: 'merriweather', name: 'Merriweather', value: '"Merriweather", serif' },
  { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
  { id: 'system', name: 'System', value: 'system-ui, -apple-system, sans-serif' },
] as const;

export type FontId = typeof AVAILABLE_FONTS[number]['id'];

interface FontState {
  fontId: FontId;
  setFont: (fontId: FontId) => void;
}

export const useFontStore = create<FontState>((set) => ({
  fontId: 'fira-code',
  setFont: (fontId) => {
    const font = AVAILABLE_FONTS.find(f => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty('--editor-font', font.value);
      localStorage.setItem('editor-font', fontId);
      set({ fontId });
    }
  },
}));

export function initializeFont() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('editor-font') as FontId | null;
  const fontId = saved && AVAILABLE_FONTS.some(f => f.id === saved) ? saved : 'fira-code';
  const font = AVAILABLE_FONTS.find(f => f.id === fontId);
  if (font) {
    document.documentElement.style.setProperty('--editor-font', font.value);
  }
  useFontStore.setState({ fontId });
}
