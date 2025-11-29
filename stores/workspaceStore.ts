import { create } from "zustand";

interface WorkspaceState {
  vaultPath: string;
  setVaultPath: (path: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  vaultPath: "./vault",
  setVaultPath: (path) => set({ vaultPath: path }),
}));

export async function fetchVaultPath(): Promise<string> {
  const response = await fetch("/api/workspace");
  if (!response.ok) throw new Error("Failed to fetch vault path");
  const data = await response.json();
  return data.vaultPath;
}

export async function updateVaultPath(path: string): Promise<void> {
  const response = await fetch("/api/workspace", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vaultPath: path }),
  });
  if (!response.ok) throw new Error("Failed to update vault path");
}