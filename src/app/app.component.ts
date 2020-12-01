import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { Capacitor, Plugins } from '@capacitor/core';
import { PowershellPluginWeb } from 'cap-powershell';
import { VvService } from './services/vv.service';


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
    private statusBar: StatusBar,
    private vvservice: VvService
  ) {
    this.initializeApp();
  }



   initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (Capacitor.platform == "electron") {
        console.log("Capacitor Electron chargé!",Plugins);

        console.log("Featherjs :",this.vvservice.feathers)
        

        
        /*
        //Get-ADDomainController –Discover
        //if ((Get-Module -ListAvailable -Name "ActiveDirectory") ) { write-output $true } else { write-output $false }
        await this.presentLoading();
        PowershellPlugin.runPowerShell(`Get-ADDomainController -Discover|convertto-json`).then(async (value) => {
          await this.hideLoading();
          console.log("Get-ADDomain :",value);
        }).catch(async (err) => {
          await this.hideLoading();
          console.log("Get-ADDomain Error :",err);
        })

         */    
      }
    });
  }

async presentLoading() {
  this.loading = await this.loadingController.create({
    message: 'Chargement en cours...',
    //duration: 20000,
    spinner: 'bubbles'
  });
  this.loading.present();
}

async hideLoading() {
  if (this.loading) {
    await this.loading.dismiss();
  }
}


async ionViewDidEnter(){

  await this.hideLoading();
  
  if (Capacitor.platform == "electron") {
      
  }
}

}
