import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolbarSlot } from '@/types/toolbar';

const defaultSlots: ToolbarSlot[] = [
  { position: 0, abilityId: null, slotKeybinding: 'mod+1' },
  { position: 1, abilityId: null, slotKeybinding: 'mod+2' },
  { position: 2, abilityId: null, slotKeybinding: 'mod+3' },
  { position: 3, abilityId: null, slotKeybinding: 'mod+4' },
  { position: 4, abilityId: null, slotKeybinding: 'mod+5' },
  { position: 5, abilityId: null, slotKeybinding: 'mod+6' },
];

interface ToolbarStore {
  slots: ToolbarSlot[];
  setSlots: (slots: ToolbarSlot[]) => void;
  setAbilityInSlot: (position: number, abilityId: string | null) => void;
  addSlot: () => void;
  removeSlot: (position: number) => void;
  swapSlots: (from: number, to: number) => void;
  resetToDefault: () => void;
}

export const useToolbarStore = create<ToolbarStore>()(
  persist(
    (set, get) => ({
      slots: defaultSlots,

      setSlots: (slots) => set({ slots }),

      setAbilityInSlot: (position, abilityId) => {
        const slots = [...get().slots];
        const slotIndex = slots.findIndex((s) => s.position === position);
        if (slotIndex !== -1) {
          slots[slotIndex] = { ...slots[slotIndex], abilityId };
          set({ slots });
        }
      },

      addSlot: () => {
        const slots = get().slots;
        const newPosition = slots.length;
        set({
          slots: [
            ...slots,
            {
              position: newPosition,
              abilityId: null,
              slotKeybinding: `mod+${newPosition + 1}`,
            },
          ],
        });
      },

      removeSlot: (position) => {
        const slots = get()
          .slots.filter((s) => s.position !== position)
          .map((s, idx) => ({
            ...s,
            position: idx,
            slotKeybinding: `mod+${idx + 1}`,
          }));
        set({ slots });
      },

      swapSlots: (from, to) => {
        const slots = [...get().slots];
        const fromAbility = slots[from].abilityId;
        const toAbility = slots[to].abilityId;
        slots[from] = { ...slots[from], abilityId: toAbility };
        slots[to] = { ...slots[to], abilityId: fromAbility };
        set({ slots });
      },

      resetToDefault: () => set({ slots: defaultSlots }),
    }),
    {
      name: 'delapanai-toolbar',
    }
  )
);
