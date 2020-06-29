import { WebPlugin } from "@capacitor/core";
import { PowershellPluginPlugin } from "./definitions";
const { remote } = require("electron");

export class PowershellPluginPluginWeb extends WebPlugin
  implements PowershellPluginPlugin {
  Path: any = null;
  NodeFs: any = null;
  RemoteRef: any = null;

  constructor() {
    super({
      name: "PowershellPluginPlugin",
      platforms: ["electron"],
    });
    console.log("PowershellPluginPlugin");
    this.RemoteRef = remote;
    this.Path = require("path");
    this.NodeFs = require("fs");
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log("ECHO", options);
    console.log(this.RemoteRef);
    return options;
  }
}

const PowershellPluginPlugin = new PowershellPluginPluginWeb();

export { PowershellPluginPlugin };

import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(PowershellPluginPlugin);