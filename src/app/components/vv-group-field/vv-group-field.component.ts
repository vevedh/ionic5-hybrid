import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig, FormlyField, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  selector: 'app-vv-group-field',
  templateUrl: './vv-group-field.component.html',
  styleUrls: ['./vv-group-field.component.scss'],
})
export class VvGroupFieldComponent extends FieldType implements OnInit {
  builder: FormlyFormBuilder;
  config: FormlyConfig;
  parentForm: FormlyFieldConfig;
  editable: boolean;


  constructor(builder: FormlyFormBuilder,config:FormlyConfig) { 
    super();
    this.builder = builder;
    this.config = config;
    
   
  }

  ngOnInit() {
    if (this.field) {
      console.log("Champs du group :",this.field)
      this.parentForm = this.field.parent;
      this.editable = this.parentForm.templateOptions?.editable;
      console.log("Form Editor :",this.parentForm)
      console.log("Formulaire conf :",this.config)
      
    }
  }

  active(i):string {
    //console.log("Formulaire conf :",this.config)
    this.editable = this.parentForm.templateOptions?.editable;
    //console.log("Form edit :", this.parentForm.templateOptions?.editable)
    //console.log("Form field id:", i)

    return (this.editable && (i==Number(this.field.templateOptions.currentIndexGroup)))?'active':''
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every(f => this.isValid(f));
  }

}
