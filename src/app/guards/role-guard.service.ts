import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    //const token = this.auth.token;
    
    if ( !this.auth.authenticated() || (this.auth.getRole() !== expectedRole) ) { //|| this.auth.role !== expectedRole
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
