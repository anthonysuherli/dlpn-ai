import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  },
}));

export function initializeTheme() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('theme') as Theme | null;
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  useThemeStore.setState({ theme });
}
