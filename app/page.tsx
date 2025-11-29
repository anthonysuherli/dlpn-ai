"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { TitleBar } from "@/components/TitleBar";
import { LeftSidebar, FileItem } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { StatusBar } from "@/components/StatusBar";
import { AbilityBar } from "@/components/toolbar";
import { useKeybindings } from "@/hooks/useKeybindings";
import { initializeTheme } from "@/stores/themeStore";
import { initializeFont } from "@/stores/fontStore";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function Home() {
  useKeybindings();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(240);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileTreeKey, setFileTreeKey] = useState(0);
  const currentContentRef = useRef("");

  useEffect(() => {
    initializeTheme();
    initializeFont();
    const savedWidth = localStorage.getItem('left-sidebar-width');
    if (savedWidth) {
      setLeftSidebarWidth(parseInt(savedWidth, 10));
    }
  }, []);

  const handleSidebarWidthChange = useCallback((width: number) => {
    setLeftSidebarWidth(width);
    localStorage.setItem('left-sidebar-width', String(width));
  }, []);

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [colCount, setColCount] = useState(1);

  const fileName = currentFilePath
    ? currentFilePath.split('/').pop() || "Untitled.md"
    : "Untitled.md";

  const handleEditorUpdate = useCallback(
    (stats: {
      words: number;
      chars: number;
      lines: number;
      col: number;
    }) => {
      setWordCount(stats.words);
      setCharCount(stats.chars);
      setLineCount(stats.lines);
      setColCount(stats.col);
    },
    []
  );

  const handleContentChange = useCallback((content: string, dirty: boolean) => {
    currentContentRef.current = content;
    setIsDirty(dirty);
  }, []);

  const handleFileSelect = useCallback(async (file: FileItem) => {
    if (file.type === "folder") return;

    try {
      const response = await fetch(`/api/files/${file.path}`);
      if (!response.ok) throw new Error("Failed to fetch file");
      const data = await response.json();
      setCurrentFilePath(file.path);
      setFileContent(data.content);
      setIsDirty(false);
    } catch (error) {
      console.error("Error loading file:", error);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentFilePath || !isDirty) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/files/${currentFilePath}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContentRef.current }),
      });
      if (!response.ok) throw new Error("Failed to save file");
      setFileContent(currentContentRef.current);
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving file:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentFilePath, isDirty]);

  const handleNewFile = useCallback(() => {
    setCurrentFilePath(null);
    setFileContent("");
    setIsDirty(false);
    currentContentRef.current = "";
  }, []);

  const handleOpenFolder = useCallback(() => {
    setCurrentFilePath(null);
    setFileContent("");
    setIsDirty(false);
    currentContentRef.current = "";
    setFileTreeKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setLeftSidebarOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <TitleBar
        fileName={fileName}
        leftSidebarOpen={leftSidebarOpen}
        rightSidebarOpen={rightSidebarOpen}
        onToggleLeftSidebar={() => setLeftSidebarOpen((prev) => !prev)}
        onToggleRightSidebar={() => setRightSidebarOpen((prev) => !prev)}
        onNewFile={handleNewFile}
        onOpenFolder={handleOpenFolder}
        onSave={handleSave}
        isDirty={isDirty}
        currentPath={currentFilePath}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          key={fileTreeKey}
          isOpen={leftSidebarOpen}
          width={leftSidebarWidth}
          onWidthChange={handleSidebarWidthChange}
          onFileSelect={handleFileSelect}
          selectedFilePath={currentFilePath}
        />

        <main
          className="flex-1 overflow-auto"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-w-3xl mx-auto h-full">
            <Editor
              content={fileContent}
              onUpdate={handleEditorUpdate}
              onContentChange={handleContentChange}
            />
          </div>
        </main>

        <RightSidebar isOpen={rightSidebarOpen} />
      </div>

      <StatusBar
        wordCount={wordCount}
        charCount={charCount}
        line={lineCount}
        col={colCount}
        isDirty={isDirty}
        isSaving={isSaving}
      />

      <AbilityBar />
    </div>
  );
}
