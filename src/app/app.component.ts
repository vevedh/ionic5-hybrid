import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { PowershellPlugin} from 'cap-powershell';
import { Capacitor, Plugins } from '@capacitor/core';
//import { PowershellPlugin } from "cap-powershell";

//import { registerWebPlugin } from "@capacitor/core";
//registerWebPlugin(PowershellPlugin);
//const { PowershellPlugin } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (Capacitor.platform == "electron") {
        console.log("Capacitor Electron chargé!",Plugins);
        Plugins.PowershellPlugin.echo('test de veve').then((val)=>{
          console.log("Result :",val);
        })
        
      }
    });
  }
}
