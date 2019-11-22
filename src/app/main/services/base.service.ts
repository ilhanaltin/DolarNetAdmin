import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServiceResult } from '../models/ServiceResult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  post<T>(url: string, postValue: any, allowAnonymous: boolean = false) : Observable<ServiceResult<T>>
  {
    let headerWithToken = this.headers.set("Authorization", "Bearer " + localStorage.getItem("token"));  

    let options = { headers: allowAnonymous ? this.headers: headerWithToken };

    return this.httpClient.post(url, JSON.stringify(postValue),  options)
    .pipe(
      map(responseData => {
         return responseData as ServiceResult<T>;        
      }));
  }

  get<T>(url: string, myParams: HttpParams = null, allowAnonymous: boolean = false)
  {
    let headerWithToken = this.headers.set("Authorization", "Bearer " + localStorage.getItem("token"));  

    let options = myParams == null ? 
          { headers: allowAnonymous ? this.headers: headerWithToken} : 
              { headers: allowAnonymous ? this.headers: headerWithToken, params: myParams};

    return this.httpClient.get<ServiceResult<T>>(url, options)
    .pipe(
      map(responseData => {

        var resp = responseData as ServiceResult<T>;
        
        return resp;
      }));
  }

  getWithNoParameter<T>(url: string, allowAnonymous: boolean = false)
  {
    let headerWithToken = this.headers.set("Authorization", "Bearer " + localStorage.getItem("token"));  

    let options = { headers: allowAnonymous ? this.headers: headerWithToken};

    return this.httpClient.get<ServiceResult<T>>(url, options)
    .pipe(
      map(responseData => {

        var resp = responseData as ServiceResult<T>;
        
        return resp;
      }));
  }

  delete<T>(url: string, myParams: HttpParams, allowAnonymous: boolean = false)
  {       
    let headerWithToken = this.headers.set("Authorization", "Bearer " + localStorage.getItem("token"));  

    let options = { headers: allowAnonymous ? this.headers: headerWithToken, params: myParams};

    return this.httpClient.delete<ServiceResult<T>>(url, options)
      .pipe(
        map(responseData => {
          var resp = responseData as ServiceResult<T>;

          return resp;
        }));
  }
}