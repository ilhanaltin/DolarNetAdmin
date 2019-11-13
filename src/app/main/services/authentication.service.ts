import { Router } from '@angular/router';
import { UserVM } from './../models/user/UserVM';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { LoginResponseDetailsVM } from '../models/authentication/LoginResponseDetailsVM';
import { apiConfig } from 'app/fuse-config/api.config';
import {Md5} from "md5-typescript";
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  helper = new JwtHelperService();

   /**
     * Constructor
     *
     * @param {BaseService} _baseService
     * @param {Router} _router
     */
  constructor(private _baseService: BaseService, private _router: Router) { }

  login(credentials) {

    console.log(credentials.password);
    credentials.password = Md5.init(credentials.password);
    console.log(credentials.password);
    
    return this._baseService.post<LoginResponseDetailsVM>(apiConfig.Api.Main.Url 
      + apiConfig.Services.User.Authenticate, 
        credentials, false)
        .pipe(
          map(response => {
            if(response.status == 200)
            {
                localStorage.setItem("token", response.result.token);
                localStorage.setItem("current-user",JSON.stringify(response.result.user));
                //localStorage.setItem("token","Bearer " + response.result.token);
                return true;
            }

            return false;
         }));
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('current-user');

    this._router.navigate(['/login']);
  }

  isLoggedIn()
  {
    let token = localStorage.getItem('token');

    return token != null && !this.helper.isTokenExpired(token);
  }

  get currentUserFromJwt()
  {
    let token = localStorage.getItem('token');

    if(!token) return null;

    return this.helper.decodeToken("Bearer " + token);
  }

  get currentUser()
  {
    let user = JSON.parse(localStorage.getItem('current-user')) as UserVM;

    if(!user) return new UserVM({});

    return user;
  }
}
