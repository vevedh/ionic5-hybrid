import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Capacitor, Plugins , Device, App, Filesystem,Modals,Network,SplashScreen} from '@capacitor/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
//import { PowershellPlugin } from 'cap-powershell';

const { PowershellPlugin } = Plugins


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  onError: boolean = false;

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController,private menuController: MenuController) {
    this.menuController.enable(false,'first')
    
  }

  async ionViewDidEnter(){
    await this.hideLoading()
    
    App.getState().then((state)=>{
      console.log("Application state :",state)
    })
   
    if (Capacitor.platform == "electron") {
      console.log("Capacitor Electron chargé!",Plugins);

      this.fields = [
        {
          key:'Domain',
          type:'input',
          templateOptions: {
            label: 'Nom de domaine :',
            readonly: true,
            
          },
          
        },
        {
          key:'Name',
          type:'input',
          templateOptions: {
            label: 'Nom du DC joignable :',
            readonly: true
            
          }
        },
        {
          key:'Site',
          type:'input',
          templateOptions: {
            label: 'Nom du Site :',
            readonly: true
            
          }
        },
        {
          key:'IPv4Address',
          type:'input',
          templateOptions: {
            label: 'Ip :',
            readonly: true
            
          }
        }
      ]
      

/*
      PowershellPlugin.SysInfosRef.chassis().then((infos)=>{
        console.log("Chassis info :",infos)
      })

      PowershellPlugin.SysInfosRef.system().then((infos)=>{
        console.log("System info :",infos)
      })
   */   
      //Get-ADDomainController –Discover
      //if ((Get-Module -ListAvailable -Name "ActiveDirectory") ) { write-output $true } else { write-output $false }
      await this.presentLoading();
      PowershellPlugin.runPowerShell(`Get-ADDomainController -Discover|convertto-json`).then(async (value) => {
        await this.hideLoading();
        //console.log("Get-ADDomain :",value);
        this.model = JSON.parse(value);
      }).catch(async (err) => {
        await this.hideLoading();
        this.onError = true;
        console.log("Get-ADDomain Error :",err);
      })

           
    }
  
    
  }

  submit() {

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
  try {
    await this.loading.dismiss();
  } catch (error) {
    
  }
    
  
}

}
