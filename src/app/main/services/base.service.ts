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

  post<T>(url: string, postValue: any) : Observable<ServiceResult<T>>
  {
    let headerWithToken = this.headers.set("Authorization", localStorage.getItem("token") == null ? "" : "Bearer " + localStorage.getItem("token"));  

    let options = { headers: headerWithToken };

    return this.httpClient.post(url, JSON.stringify(postValue),  options)
    .pipe(
      map(responseData => {
         return responseData as ServiceResult<T>;        
      }));
  }

  get<T>(url: string, myParams: HttpParams = null)
  {
    let headerWithToken = this.headers.set("Authorization", localStorage.getItem("token") == null ? "" : "Bearer " + localStorage.getItem("token"));  

    let options = myParams == null ? 
          { headers: headerWithToken } : 
              { headers: headerWithToken , params: myParams};

    return this.httpClient.get<ServiceResult<T>>(url, options)
    .pipe(
      map(responseData => {

        var resp = responseData as ServiceResult<T>;
        
        return resp;
      }));
  }

  getWithNoParameter<T>(url: string)
  {
    let headerWithToken = this.headers.set("Authorization", localStorage.getItem("token") == null ? "" : "Bearer " + localStorage.getItem("token"));  

    let options = { headers: headerWithToken};

    return this.httpClient.get<ServiceResult<T>>(url, options)
    .pipe(
      map(responseData => {

        var resp = responseData as ServiceResult<T>;
        
        return resp;
      }));
  }

  delete<T>(url: string, myParams: HttpParams)
  {       
    let headerWithToken = this.headers.set("Authorization", localStorage.getItem("token") == null ? "" : "Bearer " + localStorage.getItem("token"));  

    let options = { headers: headerWithToken, params: myParams};

    return this.httpClient.delete<ServiceResult<T>>(url, options)
      .pipe(
        map(responseData => {
          var resp = responseData as ServiceResult<T>;

          return resp;
        }));
  }
}