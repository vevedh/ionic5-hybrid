
import { Component } from '@angular/core';


//import { PowershellPlugin } from 'cap-powershell';
import { Capacitor , Plugins } from '@capacitor/core'

const { PowershellPlugin } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {
    
    
  }

  ionViewDidEnter(){
   
    console.log("Powershell Obj :", Capacitor)
    if (Capacitor.platform == "electron") {
      PowershellPlugin.echo("Bonjour");
    }
  }

}
