import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { workspaceConfig } from '../config';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

function readDirectory(dirPath: string, basePath: string = ''): FileNode[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    const nodes: FileNode[] = entries
      .filter((entry) => !entry.name.startsWith('.'))
      .map((entry) => {
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          return {
            id: relativePath,
            name: entry.name,
            type: 'folder' as const,
            path: relativePath,
            children: readDirectory(fullPath, relativePath),
          };
        }

        return {
          id: relativePath,
          name: entry.name,
          type: 'file' as const,
          path: relativePath,
        };
      })
      .sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });

    return nodes;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const vaultPath = workspaceConfig.getResolvedPath();

    if (!fs.existsSync(vaultPath)) {
      fs.mkdirSync(vaultPath, { recursive: true });
    }

    const files = readDirectory(vaultPath);

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json({ error: 'Failed to read files' }, { status: 500 });
  }
}
