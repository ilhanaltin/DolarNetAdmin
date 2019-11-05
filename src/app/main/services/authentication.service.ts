import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { LoginResponseDetailsVM } from '../models/authentication/LoginResponseDetailsVM';
import { apiConfig } from 'app/fuse-config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

   /**
     * Constructor
     *
     * @param {BaseService} _baseService
     */
  constructor(private _baseService: BaseService) { }

  login(credentials) {
    //let post = { UserName: 'ilhanaltin', Password: 'e44f5f0bf7a453a731217f288641ab16', RoleId: 1 }
    console.log(JSON.stringify(credentials));
    return this._baseService.post<LoginResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.User.Authenticate, JSON.stringify(credentials), false);
  }
}
