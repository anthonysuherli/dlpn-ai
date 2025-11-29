'use client';

import { AbilitySlot } from './AbilitySlot';
import { useToolbarStore } from '@/stores/toolbarStore';

export function AbilityBar() {
  const { slots } = useToolbarStore();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50vw',
        transform: 'translateX(-50%)',
        zIndex: 40,
      }}
    >
      <div
        className="flex items-center gap-1 p-2 backdrop-blur-md rounded-xl"
        style={{
          backgroundColor: 'rgba(18, 18, 26, 0.6)',
        }}
      >
        {slots.map((slot, index) => (
          <AbilitySlot key={slot.position} slot={slot} index={index} />
        ))}
      </div>
    </div>
  );
}
