import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  constructor(private auth:AuthService, private router:Router) { 
    this.fields = [
      {
        key: 'username',
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Nom d\'utilisateur:',
          labelPosition: 'stacked'
        }
      },{
        key: 'password',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Mot de passe:',
          labelPosition: 'stacked'
        }
      },{
        key: 'strategy',
        type: 'input',
        defaultValue: 'ldap',
        templateOptions: {
          hidden: true,
          
        },
        hide: true
      }
    ]
  }

  ngOnInit() {
  }


  login() {
      this.auth.logIn(this.model).then((authVal)=>{
        this.auth.authenticated()
        console.log("Authentication :",authVal)
        this.router.navigate(['/admin/profil'])
      }).catch((err)=>{
        this.router.navigate(['/admin/login'])
      })
  }
}
