import { ToolbarConfig } from './toolbar';

export interface UserPreferences {
  activeToolbarId: string;
  toolbars: ToolbarConfig[];
  showTooltips: boolean;
  tooltipDelay: number;
  enableAnimations: boolean;
  theme: 'dark' | 'light';
}
