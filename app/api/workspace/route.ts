import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { workspaceConfig } from "../config";

export async function GET() {
  try {
    const resolvedPath = workspaceConfig.getResolvedPath();
    return NextResponse.json({
      vaultPath: workspaceConfig.vaultPath,
      resolvedPath,
      exists: fs.existsSync(resolvedPath),
    });
  } catch (error) {
    console.error("Error getting workspace:", error);
    return NextResponse.json(
      { error: "Failed to get workspace info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { vaultPath } = body;

    if (!vaultPath || typeof vaultPath !== "string") {
      return NextResponse.json(
        { error: "vaultPath must be a non-empty string" },
        { status: 400 }
      );
    }

    workspaceConfig.vaultPath = vaultPath;
    const resolvedPath = workspaceConfig.getResolvedPath();

    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    }

    const stats = fs.statSync(resolvedPath);
    if (!stats.isDirectory()) {
      return NextResponse.json(
        { error: "Path must be a directory" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      vaultPath: workspaceConfig.vaultPath,
      resolvedPath,
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}
