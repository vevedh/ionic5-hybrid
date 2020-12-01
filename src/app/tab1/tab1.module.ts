import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { VvFormEditorComponent } from '../components/vv-form-editor/vv-form-editor.component';
import { VvGroupFieldComponent } from '../components/vv-group-field/vv-group-field.component';
import { applyEmailValidation } from '../services/email.extension';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyModule } from '@ngx-formly/core';

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
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1PageModule {}
