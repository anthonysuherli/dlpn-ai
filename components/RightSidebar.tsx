"use client";

import { useState } from "react";
import { Hash, Link, List } from "lucide-react";

type TabId = "outline" | "links" | "tags";

interface OutlineItem {
  id: string;
  text: string;
  level: number;
}

const mockOutline: OutlineItem[] = [
  { id: "1", text: "Introduction", level: 1 },
  { id: "2", text: "Getting Started", level: 2 },
  { id: "3", text: "Installation", level: 3 },
  { id: "4", text: "Configuration", level: 3 },
  { id: "5", text: "Core Concepts", level: 2 },
  { id: "6", text: "Architecture", level: 3 },
  { id: "7", text: "Data Flow", level: 3 },
  { id: "8", text: "Advanced Topics", level: 2 },
  { id: "9", text: "Conclusion", level: 1 },
];

const mockLinks = [
  { id: "1", text: "Project Overview" },
  { id: "2", text: "Meeting Notes" },
  { id: "3", text: "AI Papers" },
];

const mockTags = [
  { id: "1", text: "project" },
  { id: "2", text: "ai" },
  { id: "3", text: "notes" },
  { id: "4", text: "research" },
];

interface RightSidebarProps {
  isOpen: boolean;
}

export function RightSidebar({ isOpen }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("outline");

  const tabs = [
    { id: "outline" as TabId, icon: List, label: "Outline" },
    { id: "links" as TabId, icon: Link, label: "Links" },
    { id: "tags" as TabId, icon: Hash, label: "Tags" },
  ];

  return (
    <aside
      className="sidebar-transition flex-shrink-0 overflow-hidden flex flex-col"
      style={{
        width: isOpen ? "240px" : "0px",
        backgroundColor: "var(--bg-secondary)",
        borderLeft: isOpen ? "1px solid var(--border-color)" : "none",
      }}
    >
      <div
        className="flex-1 overflow-y-auto"
        style={{ opacity: isOpen ? 1 : 0 }}
      >
        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-sm"
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--text-normal)"
                    : "var(--text-muted)",
                backgroundColor:
                  activeTab === tab.id
                    ? "var(--bg-tertiary)"
                    : "transparent",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
              }}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-2">
          {activeTab === "outline" && (
            <div>
              {mockOutline.map((item) => (
                <div
                  key={item.id}
                  className="py-1 px-2 rounded cursor-pointer text-sm truncate"
                  style={{
                    paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                    color:
                      item.level === 1
                        ? "var(--text-normal)"
                        : "var(--text-muted)",
                    fontSize: item.level === 1 ? "14px" : "13px",
                    fontWeight: item.level === 1 ? 500 : 400,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {item.text}
                </div>
              ))}
            </div>
          )}

          {activeTab === "links" && (
            <div>
              <div
                className="text-xs uppercase tracking-wider px-2 py-1 mb-1"
                style={{ color: "var(--text-faint)" }}
              >
                Backlinks
              </div>
              {mockLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-sm"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <Link size={12} />
                  {link.text}
                </div>
              ))}
            </div>
          )}

          {activeTab === "tags" && (
            <div className="flex flex-wrap gap-2 p-1">
              {mockTags.map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-tertiary)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <Hash size={10} />
                  {tag.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
