import { WebPlugin } from '@capacitor/core';
import { PowershellPluginPlugin } from './definitions';

export class PowershellPluginWeb extends WebPlugin implements PowershellPluginPlugin {
  constructor() {
    super({
      name: 'PowershellPlugin',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const PowershellPlugin = new PowershellPluginWeb();

export { PowershellPlugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(PowershellPlugin);
