'use client';

import { useEffect } from 'react';
import { useToolbarStore } from '@/stores/toolbarStore';
import { useEditorStore } from '@/stores/editorStore';
import { abilityRegistry } from '@/abilities/registry';

export function useKeybindings() {
  const { slots } = useToolbarStore();
  const { editor } = useEditorStore();

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        const slotIndex = parseInt(e.key) - 1;
        const slot = slots[slotIndex];

        if (slot?.abilityId) {
          e.preventDefault();
          const ability = abilityRegistry.get(slot.abilityId);
          if (ability && (!ability.canExecute || ability.canExecute(editor))) {
            ability.execute(editor);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, slots]);
}
