import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPage } from './admin.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AdminPageRoutingModule } from './admin-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: AdminPage }]),
    AdminPageRoutingModule,
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
