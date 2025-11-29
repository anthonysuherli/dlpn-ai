"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { FileIcon } from "./FileIcon";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileItem[];
}

interface LeftSidebarProps {
  isOpen: boolean;
  width: number;
  onWidthChange: (width: number) => void;
  onFileSelect: (file: FileItem) => void;
  selectedFilePath: string | null;
}

function FileTreeItem({
  item,
  depth = 0,
  onFileSelect,
  selectedFilePath,
}: {
  item: FileItem;
  depth?: number;
  onFileSelect: (file: FileItem) => void;
  selectedFilePath: string | null;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = item.type === "folder";
  const isSelected = item.path === selectedFilePath;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(item);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 rounded cursor-pointer group"
        style={{
          paddingLeft: `${depth * 12 + 8}px`,
          backgroundColor: isSelected ? "var(--bg-active)" : "transparent",
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
            ) : (
              <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
            )}
            <FileIcon name={item.name} type="folder" isOpen={isExpanded} size={16} />
          </>
        ) : (
          <>
            <span className="w-[14px]" />
            <FileIcon name={item.name} type="file" size={16} />
          </>
        )}
        <span
          className="text-sm truncate"
          style={{ color: isSelected ? "var(--accent)" : "var(--text-normal)" }}
        >
          {item.name}
        </span>
      </div>
      {isFolder && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              selectedFilePath={selectedFilePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LeftSidebar({
  isOpen,
  width,
  onWidthChange,
  onFileSelect,
  selectedFilePath,
}: LeftSidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/files");
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const clampedWidth = Math.max(180, Math.min(480, newWidth));
      onWidthChange(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <aside
      className="flex-shrink-0 overflow-hidden flex flex-col relative"
      style={{
        width: isOpen ? `${width}px` : "0px",
        backgroundColor: "var(--bg-secondary)",
        borderRight: isOpen ? "1px solid var(--border-color)" : "none",
        transition: isResizing ? "none" : "width 0.2s ease",
      }}
    >
      <div
        className="flex-1 overflow-y-auto"
        style={{ opacity: isOpen ? 1 : 0 }}
      >
        {/* Action buttons */}
        <div
          className="flex items-center gap-1 p-2"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <button
            className="p-2 rounded"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Search size={16} />
          </button>
          <button
            className="p-2 rounded"
            style={{ color: "var(--text-muted)" }}
            onClick={fetchFiles}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            title="Refresh files"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* File tree */}
        <div className="py-2">
          <div
            className="px-3 py-1 text-xs uppercase tracking-wider"
            style={{ color: "var(--text-faint)" }}
          >
            Vault
          </div>

          {loading && files.length === 0 && (
            <div
              className="flex items-center justify-center py-8"
              style={{ color: "var(--text-muted)" }}
            >
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}

          {error && (
            <div
              className="px-3 py-2 text-sm"
              style={{ color: "var(--accent)" }}
            >
              {error}
            </div>
          )}

          {!loading && !error && files.length === 0 && (
            <div
              className="px-3 py-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No files found
            </div>
          )}

          {files.map((item) => (
            <FileTreeItem
              key={item.id}
              item={item}
              onFileSelect={onFileSelect}
              selectedFilePath={selectedFilePath}
            />
          ))}
        </div>
      </div>

      {/* Resize handle */}
      {isOpen && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize group"
          style={{ zIndex: 10 }}
        >
          <div
            className="w-full h-full transition-colors"
            style={{
              backgroundColor: isResizing ? "var(--accent)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isResizing)
                e.currentTarget.style.backgroundColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              if (!isResizing)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          />
        </div>
      )}
    </aside>
  );
}
