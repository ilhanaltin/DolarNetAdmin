import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { LoginResponseDetailsVM } from '../models/authentication/LoginResponseDetailsVM';
import { apiConfig } from 'app/fuse-config/api.config';
import {Md5} from "md5-typescript";

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

    credentials.password = Md5.init(credentials.password);
    
    return this._baseService.post<LoginResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.User.Authenticate, credentials, false);
  }
}
