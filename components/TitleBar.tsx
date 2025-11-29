"use client";

import { useState, useRef, useEffect } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Sun,
  Moon,
  Type,
  ChevronDown,
} from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { useThemeStore } from "@/stores/themeStore";
import { useFontStore, AVAILABLE_FONTS } from "@/stores/fontStore";
import { FileMenu } from "./FileMenu";

interface TitleBarProps {
  fileName: string;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onNewFile?: () => void;
  onOpenFolder?: (path: string) => void;
  onSave?: () => void;
  isDirty?: boolean;
  currentPath?: string | null;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  title: string;
}

function ToolbarButton({ icon, isActive, onClick, title }: ToolbarButtonProps) {
  return (
    <button
      className="p-1.5 rounded"
      style={{
        color: isActive ? "var(--accent)" : "var(--text-muted)",
        backgroundColor: isActive ? "var(--bg-active)" : "transparent",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
      title={title}
    >
      {icon}
    </button>
  );
}

function FontSelector() {
  const { fontId, setFont } = useFontStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFont = AVAILABLE_FONTS.find(f => f.id === fontId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 text-xs" style={{ color: "var(--text-muted)" }}>
        <Type size={14} />
        <span className="max-w-[80px] truncate">Fira Code</span>
        <ChevronDown size={12} />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
        style={{ color: "var(--text-muted)" }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        title="Select font"
      >
        <Type size={14} />
        <span className="max-w-[80px] truncate">{currentFont?.name}</span>
        <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 py-1 rounded shadow-lg z-50 min-w-[140px]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          {AVAILABLE_FONTS.map((font) => (
            <button
              key={font.id}
              className="w-full px-3 py-1.5 text-left text-xs"
              style={{
                color: font.id === fontId ? "var(--accent)" : "var(--text-muted)",
                backgroundColor: font.id === fontId ? "var(--bg-active)" : "transparent",
              }}
              onClick={() => {
                setFont(font.id);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                if (font.id !== fontId) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                if (font.id !== fontId) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {font.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TitleBar({
  fileName,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onNewFile,
  onOpenFolder,
  onSave,
  isDirty,
  currentPath,
}: TitleBarProps) {
  const { editor } = useEditorStore();
  const { theme, toggleTheme } = useThemeStore();

  const toolbarItems = [
    {
      icon: <Bold size={14} />,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      title: "Bold (Ctrl+B)",
    },
    {
      icon: <Italic size={14} />,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      title: "Italic (Ctrl+I)",
    },
    {
      icon: <Strikethrough size={14} />,
      action: () => editor?.chain().focus().toggleStrike().run(),
      isActive: editor?.isActive("strike"),
      title: "Strikethrough",
    },
    {
      icon: <Code size={14} />,
      action: () => editor?.chain().focus().toggleCode().run(),
      isActive: editor?.isActive("code"),
      title: "Code (Ctrl+E)",
    },
    { type: "divider" },
    {
      icon: <Heading1 size={14} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor?.isActive("heading", { level: 1 }),
      title: "Heading 1",
    },
    {
      icon: <Heading2 size={14} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor?.isActive("heading", { level: 2 }),
      title: "Heading 2",
    },
    { type: "divider" },
    {
      icon: <List size={14} />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: <ListOrdered size={14} />,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive("orderedList"),
      title: "Numbered List",
    },
    {
      icon: <Quote size={14} />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: editor?.isActive("blockquote"),
      title: "Quote",
    },
  ];

  return (
    <div
      className="flex items-center justify-between px-2"
      style={{
        height: "40px",
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded"
          style={{ color: "var(--text-muted)" }}
          onClick={onToggleLeftSidebar}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title="Toggle left sidebar (Ctrl+\)"
        >
          {leftSidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>

        <FileMenu
          onNewFile={onNewFile}
          onOpenFolder={onOpenFolder}
          onSave={onSave}
          isDirty={isDirty}
          currentPath={currentPath}
        />

        <div
          className="w-px h-5 mx-1"
          style={{ backgroundColor: "var(--border-subtle)" }}
        />

        <div className="flex items-center gap-0.5">
          {toolbarItems.map((item, index) =>
            item.type === "divider" ? (
              <div
                key={index}
                className="w-px h-4 mx-1"
                style={{ backgroundColor: "var(--border-subtle)" }}
              />
            ) : (
              <ToolbarButton
                key={index}
                icon={item.icon}
                isActive={item.isActive}
                onClick={item.action!}
                title={item.title!}
              />
            )
          )}
        </div>

        <div
          className="w-px h-5 mx-1"
          style={{ backgroundColor: "var(--border-subtle)" }}
        />

        <FontSelector />
      </div>

      <span
        className="text-sm font-medium"
        style={{ color: "var(--text-normal)" }}
      >
        {fileName}
      </span>

      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded"
          style={{ color: "var(--text-muted)" }}
          onClick={toggleTheme}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="p-2 rounded"
          style={{ color: "var(--text-muted)" }}
          onClick={onToggleRightSidebar}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title="Toggle right sidebar"
        >
          {rightSidebarOpen ? (
            <PanelRightClose size={18} />
          ) : (
            <PanelRightOpen size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
