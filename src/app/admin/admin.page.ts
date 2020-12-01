import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss']
})
export class AdminPage {

  constructor(private menuController: MenuController) {
    this.menuController.enable(true,'first')
    //this.menuController.open('first')
  }

  ionViewDidEnter() {
    //this.menuController.enable(true,'first')
    //this.menuController.open('first')
  }

}
