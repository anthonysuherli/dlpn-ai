"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  FolderOpen,
  FilePlus,
  Save,
  FolderCog,
} from "lucide-react";

interface FileMenuProps {
  onNewFile?: () => void;
  onOpenFolder?: (path: string) => void;
  onSave?: () => void;
  isDirty?: boolean;
  currentPath?: string | null;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
}

function MenuItem({ icon, label, shortcut, onClick, disabled }: MenuItemProps) {
  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs disabled:opacity-50"
      style={{
        color: disabled ? "var(--text-faint)" : "var(--text-normal)",
        backgroundColor: "transparent",
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span style={{ color: "var(--text-faint)" }}>{shortcut}</span>
      )}
    </button>
  );
}

function MenuDivider() {
  return (
    <div
      className="my-1 mx-2"
      style={{ height: "1px", backgroundColor: "var(--border-subtle)" }}
    />
  );
}

export function FileMenu({
  onNewFile,
  onOpenFolder,
  onSave,
  isDirty,
  currentPath,
}: FileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowFolderInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showFolderInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showFolderInput]);

  const handleNewFile = () => {
    onNewFile?.();
    setIsOpen(false);
  };

  const handleOpenFolder = () => {
    setShowFolderInput(true);
  };

  const handleFolderSubmit = async () => {
    if (!folderPath.trim()) return;

    try {
      const response = await fetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vaultPath: folderPath.trim() }),
      });

      if (response.ok) {
        onOpenFolder?.(folderPath.trim());
        setFolderPath("");
        setShowFolderInput(false);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to change folder:", error);
    }
  };

  const handleSave = () => {
    onSave?.();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
        style={{ color: "var(--text-muted)" }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <span>File</span>
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 py-1 rounded shadow-lg z-50 min-w-[200px]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <MenuItem
            icon={<FilePlus size={14} />}
            label="New File"
            shortcut="Ctrl+N"
            onClick={handleNewFile}
          />

          <MenuDivider />

          {showFolderInput ? (
            <div className="px-3 py-2">
              <label
                className="block text-xs mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Folder path:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFolderSubmit();
                  if (e.key === "Escape") {
                    setShowFolderInput(false);
                    setFolderPath("");
                  }
                }}
                className="w-full px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-normal)",
                }}
                placeholder="./vault or /path/to/folder"
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 px-2 py-1 text-xs rounded"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--bg-primary)",
                  }}
                  onClick={handleFolderSubmit}
                >
                  Open
                </button>
                <button
                  className="flex-1 px-2 py-1 text-xs rounded"
                  style={{
                    backgroundColor: "var(--bg-hover)",
                    color: "var(--text-normal)",
                  }}
                  onClick={() => {
                    setShowFolderInput(false);
                    setFolderPath("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <MenuItem
              icon={<FolderOpen size={14} />}
              label="Open Folder..."
              onClick={handleOpenFolder}
            />
          )}

          <MenuItem
            icon={<FolderCog size={14} />}
            label="Change Workspace..."
            onClick={handleOpenFolder}
          />

          <MenuDivider />

          <MenuItem
            icon={<Save size={14} />}
            label="Save"
            shortcut="Ctrl+S"
            onClick={handleSave}
            disabled={!isDirty || !currentPath}
          />
        </div>
      )}
    </div>
  );
}
