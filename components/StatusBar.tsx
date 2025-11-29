"use client";

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  line: number;
  col: number;
  isDirty?: boolean;
  isSaving?: boolean;
}

export function StatusBar({
  wordCount,
  charCount,
  line,
  col,
  isDirty = false,
  isSaving = false,
}: StatusBarProps) {
  const saveStatus = isSaving
    ? "Saving..."
    : isDirty
    ? "Unsaved"
    : "Saved";

  const saveColor = isSaving
    ? "var(--text-muted)"
    : isDirty
    ? "var(--accent)"
    : "var(--text-muted)";

  return (
    <div
      className="flex items-center justify-between px-4 text-xs"
      style={{
        height: "24px",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        color: "var(--text-muted)",
      }}
    >
      <div className="flex items-center gap-4">
        <span style={{ color: saveColor }}>{saveStatus}</span>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
      <div>
        <span>
          Ln {line}, Col {col}
        </span>
      </div>
    </div>
  );
}
