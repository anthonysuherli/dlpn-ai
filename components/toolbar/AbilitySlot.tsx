'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ToolbarSlot } from '@/types/toolbar';

interface AbilitySlotProps {
  slot: ToolbarSlot;
  index: number;
}

export function AbilitySlot({ slot, index }: AbilitySlotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // TODO: Open modal to configure skill/agent instruction
    console.log(`Configure skill slot ${index + 1}`);
  };

  const keybindingDisplay = `Ctrl+${index + 1}`;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
        style={{
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: isHovered ? 'var(--text-normal)' : 'var(--text-faint)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Plus size={20} strokeWidth={2} />

        <span
          className="absolute -bottom-0.5 -right-0.5 text-[9px] px-0.5 rounded opacity-50"
          style={{ color: 'var(--text-faint)' }}
        >
          {index + 1}
        </span>
      </button>
    </div>
  );
}
