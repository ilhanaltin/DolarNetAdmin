import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _router: Router,
    private _authenticationService: AuthenticationService) { }

  canActivate(){
    if(this._authenticationService.isLoggedIn()) return true;

    this._router.navigate(['/login']);

    return false;
  }
}
