import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { FieldType, FormlyConfig, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { BehaviorSubject, Observable, of, Subscriber } from 'rxjs';




@Component({
  
  selector: 'app-champpage',
  template: `
  <ion-content padding>
    <ion-row>
      <ion-col size="12">
        <ion-item>
          <ion-label position="stacked">Nom du Champ :</ion-label>
          <ion-input type="text" placeholder="nom du nouveau champ" id="valChp" #valChp [(ngModel)]="newchamp"></ion-input>
        </ion-item>
        <ion-item>
          <ion-button (click)="add(newchamp)" expand="block" fill="solid" shape="round">
            Ajouter
          </ion-button>
        </ion-item>
      </ion-col>
      <ion-col size="12">
        
        <ion-item *ngFor="let item of champs;let i=index">
          <ion-label>{{item.label}}</ion-label>
          <ion-button (click)="delKey(i)"  size="small">
            <ion-icon slot="icon-only" name="remove-circle"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-col>
    </ion-row>
  <ion-row>
    <ion-col size="12" class="ion-text-center">
      <ion-button (click)="dissmiss(this.champs)" expand="block" fill="solid" shape="round">
        Fermer
      </ion-button>
    </ion-col>
  </ion-row>
  </ion-content>`,
  styles:[``]
})
export class NewChampPage  {


  @Input() champs:any[]=[];

  newchamp;

  constructor(private modalController: ModalController) {

  }

  add(chpval) {
    this.champs.push({ value: chpval, label:chpval })
  }

  delKey(i) {
    this.champs.splice(i,1)
  }

  dissmiss(event ) {
    this.modalController.dismiss(event)
  }
}



@Component({
  selector: 'app-vv-form-editor',
  templateUrl: './vv-form-editor.component.html',
  styleUrls: ['./vv-form-editor.component.scss'],
})
export class VvFormEditorComponent extends FieldType implements OnInit {


  builder: FormlyFormBuilder;

  editable:boolean = false;

  

  selectedType:string = 'input';
  selectedKey:string = '';
  selectedLabel:string = '';
  selectedDesc:string = '';
  selectedRequired:boolean = true;

  //optionToAdd:string[]= [''];

  champs: any[] = [];

  compTypes: any[] = [
    {value: 'select', viewValue: 'Liste selection', icon:'chevron-down'},
    {value: 'input', viewValue: 'Champ Texte', icon:'reorder-two'},
    {value: 'textarea', viewValue: 'Zone de texte', icon: 'reorder-four'},
    {value: 'radio', viewValue: 'Boutons radios', icon:'radio-button-on'},
    {value: 'group', viewValue: 'Groupe de champs', icon: 'exit'}
  ];

  currentField:FormlyFieldConfig = {}
  nbLignes: number;
  config: any;
  editorMode: boolean;
  editorModeChange: any;
  chgOptionValue: { value: any; label: any; };
  chgOption: any;
  chgRow: any;
  chgIndex: any;
  editGroup: FormlyFieldConfig[];
  currentIndexGroup: number;
  newdb: boolean;
  currentChp: string = '';
  selInputType: string = 'text';
  selPlaceHolder: string;
  selLbPosition: any;
  settings: any[];
  segment: string;
  editField: FormlyFieldConfig;


  constructor(builder: FormlyFormBuilder,config:FormlyConfig,private modalController: ModalController,private el: ElementRef,private alertController: AlertController) { 
    super();
    this.builder = builder; 
    this.config = config;
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.field.fieldGroup, event.previousIndex, event.currentIndex);
  }



  async presentModal() {
    
    const modal = await this.modalController.create({
    component: NewChampPage,
    componentProps: { champs: this.champs }
    });
  
    await modal.present();

    const data = await modal.onDidDismiss();
    console.log(data)
    this.field.templateOptions.champs = data.data;
    //this.field.templateOptions.champs.push(data.data)
    //this.champs.push({ value: data.data, label: data.data})
    
    
  
  }

  async addLigne() {
    if (this.currentChp) {

      this.field.fieldGroup.push({
        key: this.currentChp,
        type: 'input',
        templateOptions: {
          label: this.currentChp,
          description: '',
          type: 'text',
          segment: 'sproprietes'
        }
      })
    
    
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
      
      //this.champs = this.field.fieldGroup.map(x => ({ value: x.key, label:x.key}));
      
    } else {
      
        const alert = await this.alertController.create({
          header: 'Attention!',
          subHeader: 'Aucun champ sélectionné',
          message: 'Veuillez sélectionner un champ pour ajouter une ligne.',
          buttons: ['OK']
        });
      
        await alert.present();
      
    }
    
  }

 
  ngOnInit() {

    /*let ioncol = document.getElementsByClassName('active');//querySelectorAll("ion-col.active.md.hydrated");
    console.log("Ion-col :",ioncol)
    if (ioncol.length>0) {
      for (let index = 0; index < ioncol.length; index++) {
        const element = ioncol[index];
        element.classList.remove('active')
        
      }
    }*/
    if (this.field) {

      this.editField = JSON.parse(JSON.stringify(this.field));
      console.log("Form edit field :",this.editField)
      
      this.field.templateOptions.editable = this.editable;
      console.log("Form :",this)
      if (this.field.templateOptions.champs.length>0) {
        this.field.templateOptions.champs.forEach(element => {
          if (element?.value && element?.label) {
            this.champs.push(element)
          } else {
            this.champs.push({ value: element, label: element})
          }
          
        });
        this.field.templateOptions.champs = this.champs;
      } else {
        if (this.field.fieldGroup.length>0) {
          //this.champs = this.field.fieldGroup.map(x => ({ value: x.key, label:x.key}));
          this.champs = this.field.fieldGroup.map(x => (((x.fieldGroup?.length==0)||x.fieldGroup==null)?{ value: x.key, label:x.key}:null));
          this.field.templateOptions.champs = this.champs;
          this.builder.buildForm(this.form,[this.field],this.model,this.options)
        }
      }
      if (this.field.templateOptions.newdb ) {
        console.log("Mode nouvelle base de donnée");
        this.newdb = this.field.templateOptions.newdb;
      }
      
      console.log("Champs :",this.champs);
      this.nbLignes = this.field.fieldGroup.length;


      
      /*ioncol.forEach(element => {
        //if(element.classList.contains('active')) {
          element.classList.remove('active')
        //}
      });*/
    }
    
  }
  ionViewDidEnter(){
    
  }

  changeDbKey(event) {
    console.log('Event champ :',event)
  }

  segmentChanged(event) {
    console.log('Change Segment :',event)
  }

  changeEditable(event) {
    console.log('Change Editable :',event)
    this.field.templateOptions.editable = event.detail.checked;
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
    //if (!this.editable) {
      /*let ioncol = this.el.nativeElement.querySelectorAll("ion-col");
      ioncol.forEach(element => {
        if(element.classList.contains('active')) {
          element.classList.remove('active')
        }
      });*/
      //console.log("ion-col liste :",ioncol)
    //}
    //console.log('Fields :',this.field)
  }

  async addKey() {
    await this.presentModal();
    
  }


  getIcon(fi) {
    return this.compTypes.filter(x => x.value==fi)[0].icon
  }

  addRow() {
    this.currentField = {
      key: this.selectedKey,
      type: this.selectedType,
      templateOptions: {
        label: this.selectedLabel,
        description: this.selectedDesc,
        type: this.selInputType,
        placeholder: this.selPlaceHolder,
        labelPosition: this.selLbPosition,
      }
    }
    this.field.fieldGroup.push(this.currentField);
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }

  remove(i,grpIndex) {

    if (grpIndex!=null) {
      console.log("Index :",grpIndex)
      if (grpIndex>0)  {
        console.log("Index to delete :",grpIndex)
        this.field.fieldGroup[i].fieldGroup.splice(grpIndex,1);
        console.log("Index group :",this.field.fieldGroup[i])
        this.field.fieldGroup[i].templateOptions.currentIndexGroup = this.field.fieldGroup[i].fieldGroup.length-1;
        this.builder.buildForm(this.form,[this.field],this.model,this.options)
      } else {
        this.field.fieldGroup.splice(i,1);
        this.nbLignes = this.field.fieldGroup.length;
        this.builder.buildForm(this.form,[this.field],this.model,this.options)
      }
      
    } else {
      this.field.fieldGroup.splice(i,1);
      this.nbLignes = this.field.fieldGroup.length;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    }
    
  }

  onRequire(evt,row,grpIndex) {
    console.log("Checked :",evt);
    if (grpIndex!=null) {
      this.field.fieldGroup[row].fieldGroup[grpIndex].templateOptions.required = evt.detail.checked;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    } else {
      this.field.fieldGroup[row].templateOptions.required = evt.detail.checked;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    }
    
  }

  onVisible(evt,row,grpIndex) {
    console.log("Visible :",evt.detail.checked);
    if (grpIndex!=null) {
      this.field.fieldGroup[row].fieldGroup[grpIndex].hide = evt.detail.checked;
      this.field.fieldGroup[row].fieldGroup[grpIndex].hideExpression = evt.detail.checked;
      this.field.fieldGroup[row].fieldGroup[grpIndex].templateOptions.hidden = evt.detail.checked;
      this.builder.buildForm(this.form,[this.field],this.model,this.options);
    } else {
      this.field.fieldGroup[row].hide = evt.detail.checked;
      this.field.fieldGroup[row].hideExpression = evt.detail.checked;
      this.field.fieldGroup[row].templateOptions.hidden = evt.detail.checked;
      this.builder.buildForm(this.form,[this.field],this.model,this.options);
    }
    
    

  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every(f => this.isValid(f));
  }

  changeType(event,indice,field: FormlyFieldConfig) {
    console.log("Event :",event);

    if (event.detail.value == 'input') {
      this.field.fieldGroup[indice].templateOptions.labelPosition = 'stacked';
    }

    if (event.detail.value == 'select') {
      this.field.fieldGroup[indice].templateOptions.labelPosition = 'stacked';
      this.field.fieldGroup[indice].templateOptions.description = null;

      if (!this.field.fieldGroup[indice].templateOptions.options) {
        this.field.fieldGroup[indice].templateOptions.options = [ { label: '1 :', value: 'option' } ];
      }
      
    }
    if (event.detail.value == 'radio') {
      this.field.fieldGroup[indice].templateOptions.labelPosition = 'stacked';
      this.field.fieldGroup[indice].templateOptions.description = null;

      if (!this.field.fieldGroup[indice].templateOptions.options) {
        this.field.fieldGroup[indice].templateOptions.options = [ { label: '1 :', value: 'option' } ];
      }
    }
    
    //'textarea';
    if (event.detail.value == 'group') {
      console.log("Field before -> ",field);
      this.currentIndexGroup = 0;
      this.field.fieldGroup[indice] = {
        key: 'row'+indice,
        fieldGroup: [field],
        type: 'group',
        templateOptions: {
          currentIndexGroup: 0
        }
      };
      this.editGroup = [this.field.fieldGroup[indice]];
      
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
      console.log("Field -> ",field);
    } else {
      console.log("Field -> ",field);
      if ( field.type == 'group' ) {
        
        this.field.fieldGroup[indice]=field.fieldGroup[0];
      }
      
      field.type = event.detail.value;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    }

    console.log("Field to change :",this.field);


  }

  moinsGrpCursor(row) {
    console.log("Curseur moins :",this.field.fieldGroup[row].templateOptions);
    if (this.field.fieldGroup[row].templateOptions.currentIndexGroup>=1) {
      console.log("Curseur moins :",this.field.fieldGroup[row].templateOptions.currentIndexGroup)
      this.field.fieldGroup[row].templateOptions.currentIndexGroup--;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    }
  }

  plusGrpCursor(row) {
    console.log("Curseur plus :",this.field.fieldGroup[row].templateOptions);
    if ( (this.field.fieldGroup[row].templateOptions.currentIndexGroup<(this.field.fieldGroup[row].fieldGroup.length-1))) {
      
      this.field.fieldGroup[row].templateOptions.currentIndexGroup++;
      console.log("Curseur plus :",this.field.fieldGroup[row].templateOptions.currentIndexGroup)
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
    }
  }

  getCursor(row): number {
    //this.currentIndexGroup = Number(Number(this.field.fieldGroup[row].templateOptions.currentIndexGroup)+1);
    return Number(Number(this.field.fieldGroup[row].templateOptions.currentIndexGroup)+1);
  }

  changeKey(event,indice,field: FormlyFieldConfig) {
    console.log("Event :",event);
    this.field.fieldGroup[indice].key = event.detail.value;
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }

  changeGrpKey(event,indice,field: FormlyFieldConfig) {
    console.log("Event Group:",event);
    console.log("Groupe :",this.field.fieldGroup[indice]);
    this.field.fieldGroup[indice].templateOptions.active=true;
    console.log("Index groupe:",this.field.fieldGroup[indice].templateOptions?.currentIndexGroup)
    let currentIndexGroup;
    if (this.field.fieldGroup[indice].templateOptions.currentIndexGroup!=null) {
      currentIndexGroup = this.field.fieldGroup[indice].templateOptions.currentIndexGroup;
    } else {
      currentIndexGroup = this.field.fieldGroup[indice].fieldGroup.length;
    }
    console.log("Index :",currentIndexGroup)
    this.field.fieldGroup[indice].fieldGroup[currentIndexGroup].key = event.detail.value;
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }

  chgOptions(event,row,i, lg) {

    
      console.log("Taille :",i,lg);
    console.log("Value input :",event);
    console.log("Value input target :",event.currentTarget);
    //let lb = this.field.fieldGroup[row].templateOptions.options[i].label
    //this.field.fieldGroup[row].templateOptions.options[i].value = this.field.fieldGroup[row].templateOptions.options[i].label;

    console.log("Template option :",this.field.fieldGroup[row].templateOptions.options)
    
    //this.field.fieldGroup[row].templateOptions.options[i] = { value: this.field.fieldGroup[row].templateOptions.options[i].label, label: this.field.fieldGroup[row].templateOptions.options[i].label} 
    //this.builder.buildForm(this.form,[this.field],this.model,this.options)
    
   
    
    this.chgRow =row;
    this.chgIndex = i;
    this.chgOptionValue = { value:this.field.fieldGroup[row].templateOptions.options[i].label , label: this.field.fieldGroup[row].templateOptions.options[i].label}
    console.log("Change value :",this.chgOptionValue)
   
  }

  getOptions(opts): Observable<any[]> {
    return of(opts);
}

  chgOptionBlur(event,row,i) {
    /*console.log("Save options",event)
    console.log("Change row :",this.chgRow)
    console.log("Change Index :",this.chgIndex)
    console.log("Change Value :",this.chgOptionValue)
    console.log("This Field",this.field)
    console.log("Field group ",this.field.fieldGroup[this.chgRow].templateOptions.options[this.chgIndex])
    let loptions = JSON.parse(JSON.stringify(this.field.fieldGroup[this.chgRow].templateOptions.options))
    console.log("options :",loptions)
    
    this.field.fieldGroup[this.chgRow].templateOptions.options = loptions;*/
    this.field.fieldGroup[row].templateOptions.options[i] = this.chgOptionValue;
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }

  onAddOption(row,lg) {
   
    /*let loptions = JSON.parse(JSON.stringify(this.field.fieldGroup[this.chgRow].templateOptions.options));
    loptions.push({ label: '1 :', value: 'option' });
    this.field.fieldGroup[row].templateOptions.options = loptions;*/
    let loptions:any[] = this.field.fieldGroup[row].templateOptions.options as any[];
    loptions.push({ label: '1 :', value: 'option' });
    this.field.fieldGroup[row].templateOptions.options = loptions;
    //this.field.fieldGroup[row].templateOptions.options[lg].label=  `${lg} :`;
    //this.field.fieldGroup[row].templateOptions.options[lg].value= 'option' ;
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
    console.log("Option group :",this.field.fieldGroup[row])
    console.log("Option add:",this.field.fieldGroup[row].templateOptions.options);
    console.log("Field :",this.field)
    //this.field = JSON.parse(JSON.stringify(this.field));
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  
  }

  onDelOption(row,id) {

    if ((this.field.fieldGroup[row].templateOptions.options as any[]).length == 1) {
      (this.field.fieldGroup[row].templateOptions.options as any[]).splice(id,1);
      this.field.fieldGroup[row].templateOptions.options = [ { label: '1 :', value: 'option' } ];
    } else {
      (this.field.fieldGroup[row].templateOptions.options as any[]).splice(id,1);
    }
    this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }

  addRowField(row) {
    console.log("Add Group :",this.field.fieldGroup[row]);
    if (this.field.fieldGroup[row].fieldGroup.length < 3) {
      console.log("Key to add :",this.field.fieldGroup[row].fieldGroup[this.field.fieldGroup[row].templateOptions.currentIndexGroup].key);
      let key = this.field.fieldGroup[row].fieldGroup[this.field.fieldGroup[row].templateOptions.currentIndexGroup].key
      this.field.fieldGroup[row].fieldGroup.push({
            key: key,
            type: 'input',
            templateOptions: {
              labelPosition: 'stacked',
              label: 'Nouveau label',
              type: 'text',
              segment: 'sproprietes'
            }
      })
      this.field.fieldGroup[row].templateOptions.currentIndexGroup = this.field.fieldGroup[row].fieldGroup.length-1;
      this.builder.buildForm(this.form,[this.field],this.model,this.options)
  }
  }


  onSave() {
    console.log("Save Event")
    if (this.field.templateOptions?.onUpdateChange) {
      this.field.templateOptions?.onUpdateChange(this.field);
    }
    
  }
  onAdd() {
    console.log("Add Event")
    this.field.templateOptions?.onAddChange(this.field);
  }

}
