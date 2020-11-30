import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { Capacitor, Plugins } from '@capacitor/core';
import { PowershellPluginWeb } from 'cap-powershell';


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
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (Capacitor.platform == "electron") {
        console.log("Capacitor Electron chargé!",Plugins);

        


        PowershellPlugin.SysInfosRef.chassis().then((infos)=>{
          console.log("System info :",infos)
        })
        
        //Get-ADDomainController –Discover
        //if ((Get-Module -ListAvailable -Name "ActiveDirectory") ) { write-output $true } else { write-output $false }
        await this.presentLoading();
        PowershellPlugin.runPowerShell(`Import-Module -Name ActiveDirectory`).then(async (value) => {
          await this.hideLoading();
          console.log("Get-ADDomain :",value);
        }).catch(async (err) => {
          await this.hideLoading();
          console.log("Get-ADDomain Error :",err);
        })

             
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


ionViewDidEnter(){
  if (Capacitor.platform == "electron") {
      
  }
}

}
