import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DBService } from '../services/db.service'
@Injectable({
  providedIn: 'root'
})
export class LogedInGuard implements CanActivate {

  constructor(public DB:DBService, public router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if(!this.DB.IsClientLogedIn()){
      this.router.navigate(['/start']);
    }
    return this.DB.IsClientLogedIn();
  }
}
