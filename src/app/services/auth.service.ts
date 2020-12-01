
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VvService } from './vv.service';


/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  constructor(private vvservice:VvService, private router: Router) {}

  public logIn(credentials?): Promise<any> {
    return this.vvservice.feathers.authenticate(credentials);
  }

  authenticated():boolean {

    //this.vvservice.currentUser.next(this.vvservice.feathers.authenticate())
    return this.vvservice.feathers.authentication.authenticated
  }

  getRole(): string {
    return this.vvservice.currentUser.getValue().role
  }
  

  public logOut() {
    this.vvservice.feathers.logout();
    this.vvservice.feathers.set('user',null);
    this.vvservice.currentUser.next(null);
    this.router.navigate(['/']);
  }
}
