export interface ToolbarSlot {
  position: number;
  abilityId: string | null;
  slotKeybinding: string;
}

export interface ToolbarConfig {
  id: string;
  name: string;
  slots: ToolbarSlot[];
  createdAt: Date;
  updatedAt: Date;
}
