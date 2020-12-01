import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyModule } from '@ngx-formly/core';
import { VvFormEditorComponent } from 'src/app/components/vv-form-editor/vv-form-editor.component';
import { VvGroupFieldComponent } from 'src/app/components/vv-group-field/vv-group-field.component';
import { applyEmailValidation } from 'src/app/services/email.extension';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
