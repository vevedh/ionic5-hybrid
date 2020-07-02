import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//import { PowershellPlugin} from 'cap-powershell';
import { Capacitor, Plugins } from '@capacitor/core';


const { PowershellPlugin } = Plugins

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  loading: HTMLIonLoadingElement;


  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private loadingController: LoadingController,
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
        /*PowershellPlugin.runPowerShell(`Get-Process | convertTo-Json`).then((value)=>{
          console.log("Get-Process :",value);
        }) */

        this.presentLoading();
        Plugins.PowershellPlugin.runPowerShell(`Get-Process | convertTo-Json`).then((value) => {
          this.hideLoading();
          console.log("Get-Process :",value);
        }) 

        PowershellPlugin.echo('test de veve').then((val)=>{
          console.log("Result :",val);
        });

             
      }
    });
  }

async presentLoading() {
  this.loading = await this.loadingController.create({
    message: 'Hellooo',
    duration: 20000,
    spinner: 'bubbles'
  });
  this.loading.present();
}

hideLoading() {
  if (this.loading) {
    this.loading.dismiss();
  }
}


ionViewDidEnter(){
  if (Capacitor.platform == "electron") {
      
  }
}

}
