import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {  Plugins, Capacitor } from '@capacitor/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';




const { PowershellPlugin, Nodemailer , Clipboard } = Plugins
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  onError: boolean = false;

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  loading: HTMLIonLoadingElement;
  transporter: {
    host: string; port: number; secure: boolean; // true for 465, false for other ports
    auth: {
      user: string; // compte expéditeur
      pass: string; // mot de passe du compte expéditeur
    }; tls: { ciphers: string; };
  };

  constructor(private loadingController: LoadingController,private menuController: MenuController) {
    this.menuController.enable(false,'first')
  }

  async ionViewDidEnter() {

    await this.hideLoading()

    this.fields = [{
      key:'manufacturer',
      type:'input',
      templateOptions: {
        label: 'Marque :',
        readonly: true,
        
      },
      
    },{
      key:'model',
      type:'input',
      templateOptions: {
        label: 'Modèle :',
        readonly: true,
        
      },
      
    },{
      key:'serial',
      type:'input',
      templateOptions: {
        label: 'Numéro de serie :',
        readonly: true,
        
      },
      
    },{
      key:'sku',
      type:'input',
      templateOptions: {
        label: 'Unité de gestion de stock :',
        readonly: true,
        
      },
      
    },{
      key:'uuid',
      type:'input',
      templateOptions: {
        label: 'UUID :',
        readonly: true,
        
      },
      
    },{
      key:'version',
      type:'input',
      templateOptions: {
        label: 'Version :',
        readonly: true,
        
      },
      
    },{
      key:'distro',
      type:'input',
      templateOptions: {
        label: 'OS Version :',
        readonly: true,
        
      },
      
    },{
      key:'build',
      type:'input',
      templateOptions: {
        label: 'OS build :',
        readonly: true,
        
      },
      
    },{
      key:'user',
      type:'input',
      templateOptions: {
        label: 'Utilisateur :',
        readonly: true,
        
      },
      
    },
]

    if (Capacitor.platform == "electron") {

      this.transporter = {
        host: "mail.cacem.fr",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "herve.dechavigny@cacem.fr", // compte expéditeur
          pass: "d@nZel!77" // mot de passe du compte expéditeur
        },
              tls:{
            ciphers:'SSLv3'
        }
      };
    
    
     //Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object capacity | ConvertTo-JSON
     //Get-CimInstance -ClassName Win32_diskdrive | Select-Object status, model, partitions, size | ConvertTo-JSON
     //Get-CimInstance -ClassName Win32_Product | Select-Object name, version


      console.log("Capacitor Electron chargé!",Plugins);
      console.log("Capacitor Electron object InfosSystème !",PowershellPlugin.SysInfosRef);

      
      /*
      PowershellPlugin.SysInfosRef.chassis().then((infos)=>{
        console.log("Chassis info :",infos)
      })

      

      PowershellPlugin.SysInfosRef.versions().then((verinfos)=>{
        console.log("Versions info :",verinfos)
      })
      */
      
      await this.presentLoading();
      PowershellPlugin.SysInfosRef.system().then((infos)=>{
        console.log("System info :",infos)
        this.model = infos;
        PowershellPlugin.SysInfosRef.users().then((usrinfos)=>{
          console.log("Users info :", usrinfos);
          this.model = { ...this.model, user: usrinfos[0].user}
          PowershellPlugin.SysInfosRef.osInfo().then(async (osinfos)=>{
            console.log("OS info :",osinfos)
            this.model = { ...this.model, distro:osinfos.distro, build: osinfos.build };
            await this.hideLoading();
            //this.submit();
           Clipboard.read().then((value)=>{
            console.log("Clipboard :",value)
            })
          }).catch(async (err)=>{
            await this.hideLoading();
          })
        })
        
      })

      
      
    
    }
  }

  submit() {
    console.log("Nodemailer ", Nodemailer)
    const emailstart = {
        from: 'herve.dechavigny@cacem.fr',
        to: 'vevedh@gmail.com',
        subject: 'Information Système',
        html: `<b>Utilisateur :</b>${this.model.user}<br>
        <b>OS version :</b>${this.model.distro}<br>
        <b>OS build :</b>${this.model.build}<br>
        <b>Marque :</b>${this.model.manufacturer}<br>
        <b>Modèle :</b>${this.model.model}<br>
        <b>Numéro de série :</b>${this.model.serial}<br>
        <b>SKU :</b>${this.model.sku}<br>
        <b>UUID :</b>${this.model.uuid}<br>
        <b>Version :</b>${this.model.version}<br>
        `
    };

      Nodemailer.sendMail(this.transporter,emailstart).then(()=>{
        console.log("Mail envoyé")
      }).catch((err)=>{
        console.log("Erreur :",err)
      })
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
