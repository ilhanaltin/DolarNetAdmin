import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
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

    credentials.password = Md5.init(credentials.password);
    
    return this._baseService.post<LoginResponseDetailsVM>(apiConfig.Api.Main.Url 
      + apiConfig.Services.User.Authenticate, 
        credentials)
        .pipe(
          map(response => {
            if(response.status == 200)
            {
                localStorage.setItem("token", response.result.token);
                localStorage.setItem("current-user",JSON.stringify(response.result.user));
                localStorage.setItem("current-user-avatar", response.result.user.avatar);
                localStorage.setItem("current-user-role", response.result.user.roleId.toString());
            }

            return response;
         }));
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('current-user-avatar');
    localStorage.removeItem('current-user-role');

    this._router.navigate(['/login']);
  }

  isLoggedIn()
  {
    let token = localStorage.getItem('token');

    return token != null && !this.helper.isTokenExpired(token);
  }

  isAdmin()
  {
    let user = JSON.parse(localStorage.getItem('current-user')) as UserVM;

    if(!user) return false;

    return user.roleId === GlobalConstants.UserRoles.Admin;
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

  get avatar()
  {
    let avatar = localStorage.getItem('current-user-avatar');

    if(!avatar) return "assets/images/avatars/profile.jpg";

    return avatar;
  }
}
