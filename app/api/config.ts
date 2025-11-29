import path from "path";

class WorkspaceConfig {
  private _vaultPath: string = process.env.VAULT_PATH || "./vault";

  get vaultPath(): string {
    return this._vaultPath;
  }

  set vaultPath(value: string) {
    this._vaultPath = value;
  }

  getResolvedPath(): string {
    return path.resolve(process.cwd(), this._vaultPath);
  }
}

export const workspaceConfig = new WorkspaceConfig();
