import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyModule } from '@ngx-formly/core';
import { VvFormEditorComponent } from '../components/vv-form-editor/vv-form-editor.component';
import { VvGroupFieldComponent } from '../components/vv-group-field/vv-group-field.component';
import { applyEmailValidation } from '../services/email.extension';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyIonicModule,
    FormlyModule.forRoot({
      types: [
        //{ name: 'formEditor', component: FormEditorComponent},
        { name: 'vvFormEditor', component: VvFormEditorComponent},
        { name: 'group' , component: VvGroupFieldComponent}
      ],
      extensions: [{ name: 'email', extension: { prePopulate: applyEmailValidation } }],
      validationMessages: [
        { name: 'required', message: 'Ce champ est obligatoire!' },
      ],
    }),
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
