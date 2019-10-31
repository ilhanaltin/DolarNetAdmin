import { apiConfig } from './../../fuse-config/api.config';
import { StandartResponseDetailsVM } from '../Models/StandartResponseDetailsVM';
import { ServiceResult } from './../Models/ServiceResult';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { UserListResponseDetailsVM } from '../models/user/UserListResponseDetailsVM';
import { Observable } from 'rxjs';
import { UserResponseDetailsVM } from '../models/user/userResponseDetailsVM';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private baseService: BaseService) { }
  
  getAll(): Observable<ServiceResult<UserListResponseDetailsVM>> {

    let myParams = new HttpParams()
      .append('ItemCount', '10')
      .append('PageId', '1')
      .append('RoleId', '-1');

      return this.baseService.get<UserListResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.User.GetAllUser, myParams);
  }
}