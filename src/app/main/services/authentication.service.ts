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
     */
  constructor(private _baseService: BaseService) { }

  login(credentials) {

    credentials.password = Md5.init(credentials.password);
    
    return this._baseService.post<LoginResponseDetailsVM>(apiConfig.Api.Main.Url 
      + apiConfig.Services.User.Authenticate, 
        credentials, false)
        .pipe(
          map(response => {
            if(response.status == 200)
            {
                localStorage.setItem("token",response.result.token);
                //localStorage.setItem("token","Bearer " + response.result.token);
                return true;
            }

            return false;
         }));
  }

  logout(){
    localStorage.removeItem('token');
  }

  isLoggedIn()
  {
    return !this.helper.isTokenExpired();
  }

  get currentUser()
  {
    let token = localStorage.getItem('token');

    if(!token) return null;

    return this.helper.decodeToken("Bearer " + token);
  }
}
