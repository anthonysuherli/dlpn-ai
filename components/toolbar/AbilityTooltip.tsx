'use client';

import { motion } from 'framer-motion';
import { Ability } from '@/types/ability';

interface AbilityTooltipProps {
  ability: Ability;
}

const targetLabels: Record<string, string> = {
  selection: 'Selected Text',
  word: 'Word at Cursor',
  paragraph: 'Current Paragraph',
  block: 'Current Block',
  'input:string': 'Requires Input',
  'input:file': 'Requires File',
  document: 'Entire Document',
  none: 'No Target',
};

export function AbilityTooltip({ ability }: AbilityTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
    >
      <div
        className="rounded-lg p-3 shadow-xl min-w-[200px]"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-normal)' }}>
          {ability.name}
        </h3>

        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {ability.description}
        </p>

        <div
          className="flex items-center gap-2 mt-2 pt-2"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--text-faint)' }}
          >
            Target
          </span>
          <span className="text-xs" style={{ color: 'var(--accent)' }}>
            {targetLabels[ability.target]}
          </span>
        </div>

        {ability.keybinding && (
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-faint)' }}
            >
              Hotkey
            </span>
            <kbd
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-normal)' }}
            >
              {ability.keybinding}
            </kbd>
          </div>
        )}
      </div>

      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
        <div
          className="w-3 h-3 rotate-45"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
          }}
        />
      </div>
    </motion.div>
  );
}
