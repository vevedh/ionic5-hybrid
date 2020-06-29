declare module "@capacitor/core" {
  interface PluginRegistry {
    PowershellPlugin: PowershellPluginPlugin;
  }
}

export interface PowershellPluginPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}
