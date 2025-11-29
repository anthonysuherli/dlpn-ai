import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { workspaceConfig } from '../../config';

function isPathSafe(filePath: string, vaultPath: string): boolean {
  const resolvedPath = path.resolve(vaultPath, filePath);
  return resolvedPath.startsWith(vaultPath);
}

function isMarkdownFile(filePath: string): boolean {
  return filePath.endsWith('.md');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    const vaultPath = workspaceConfig.getResolvedPath();

    if (!isPathSafe(filePath, vaultPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!isMarkdownFile(filePath)) {
      return NextResponse.json({ error: 'Only markdown files are supported' }, { status: 400 });
    }

    const fullPath = path.join(vaultPath, filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    const vaultPath = workspaceConfig.getResolvedPath();

    if (!isPathSafe(filePath, vaultPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!isMarkdownFile(filePath)) {
      return NextResponse.json({ error: 'Only markdown files are supported' }, { status: 400 });
    }

    const body = await request.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Content must be a string' }, { status: 400 });
    }

    const fullPath = path.join(vaultPath, filePath);
    const dirPath = path.dirname(fullPath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    const vaultPath = workspaceConfig.getResolvedPath();

    if (!isPathSafe(filePath, vaultPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const fullPath = path.join(vaultPath, filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    fs.unlinkSync(fullPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
