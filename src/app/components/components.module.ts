import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';

import { MultiFileUploadComponent } from './multi-file-upload/multi-file-upload.component';
import { PwrshellCardComponent } from './pwrshell-card/pwrshell-card.component';
import { NewChampPage, VvFormEditorComponent } from './vv-form-editor/vv-form-editor.component';

import { VvGroupFieldComponent } from './vv-group-field/vv-group-field.component';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';




@NgModule({
    imports: [ CommonModule, FormsModule, IonicModule, DragDropModule,ReactiveFormsModule,FormlyIonicModule,
        FormlyModule.forRoot({
            extras: { lazyRender: true }
          }),],
    declarations: [WebDataRocksPivot,VvFormEditorComponent,VvGroupFieldComponent,MultiFileUploadComponent,PwrshellCardComponent,NewChampPage],
    exports: [WebDataRocksPivot,VvFormEditorComponent,VvGroupFieldComponent,MultiFileUploadComponent,PwrshellCardComponent,NewChampPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class ComponentsModule{}