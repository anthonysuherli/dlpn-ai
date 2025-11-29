"use client";

interface FileIconProps {
  name: string;
  type: "file" | "folder";
  isOpen?: boolean;
  size?: number;
  className?: string;
}

const extensionToIcon: Record<string, string> = {
  md: "file_type_markdown",
  markdown: "file_type_markdown",
  json: "file_type_json",
  ts: "file_type_typescript",
  tsx: "file_type_typescript",
  js: "file_type_js",
  jsx: "file_type_js",
  css: "file_type_css",
  html: "file_type_html",
  htm: "file_type_html",
  yaml: "file_type_yaml",
  yml: "file_type_yaml",
  txt: "file_type_text",
  png: "file_type_image",
  jpg: "file_type_image",
  jpeg: "file_type_image",
  gif: "file_type_image",
  svg: "file_type_image",
  webp: "file_type_image",
  config: "file_type_config",
};

function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return extensionToIcon[ext] || "default_file";
}

export function FileIcon({ name, type, isOpen = false, size = 16, className = "" }: FileIconProps) {
  let iconName: string;

  if (type === "folder") {
    iconName = isOpen ? "default_folder_opened" : "default_folder";
  } else {
    iconName = getFileIcon(name);
  }

  return (
    <img
      src={`/icons/${iconName}.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0 }}
    />
  );
}
