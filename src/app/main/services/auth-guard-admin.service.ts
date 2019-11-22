import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {

  constructor(private _router: Router,
    private _authenticationService: AuthenticationService) { }

  canActivate(){
    if(this._authenticationService.isAdmin()) return true;

    this._router.navigate(['/posts']);

    return false;
  }
}
