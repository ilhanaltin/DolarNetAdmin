import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { PagingVM } from '../models/PagingVM';
import { BaseService } from './base.service';
import { apiConfig } from 'app/fuse-config/api.config';
import { MediaListResponseDetailsVM } from '../models/media/MediaListResponseDetailsVM';
import { ServiceResult } from '../models/ServiceResult';
import { StandartResponseDetailsVM } from '../models/StandartResponseDetailsVM';

@Injectable()
export class FileManagerService implements Resolve<any>
{
    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;
    onPagingChanged: Subject<any>;

    medias: any[];
    pagingVM = new PagingVM({});
    
    onPagingCalculated: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _baseService: BaseService
    )
    {
        // Set the defaults
        this.onFilesChanged = new BehaviorSubject({});
        this.onFileSelected = new BehaviorSubject({});
        this.onPagingCalculated = new Subject();
        this.onPagingChanged = new Subject();

    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getFiles()
            ]).then(
                ([files]) => {

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getFiles();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get files
     *
     * @returns {Promise<any>}
     */
    getFiles(): Promise<any>
    {
        let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString());
                    
        return new Promise((resolve, reject) => {
            this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Media.GetAll, myParams)
                .subscribe((response: any) => {

                    let result = response as ServiceResult<MediaListResponseDetailsVM>;
                    this.pagingVM = result.result.pagingVM;
                    
                    this.medias = result.result.mediaList;

                    this.onFilesChanged.next(this.medias);
                    this.onFileSelected.next(this.medias[0]);
                    this.onPagingCalculated.next(this.pagingVM);
                    resolve(response);
                }, reject);
        });
    }    

    getFilesForListControl(): Observable<ServiceResult<MediaListResponseDetailsVM>>
    {
        let myParams = new HttpParams()
                .append('ItemCount', "50")
                .append('PageId', "0");
                    
        return this._baseService.get<MediaListResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Media.GetAll, myParams);                
    }

    deleteStatus(mediaId): Observable<ServiceResult<StandartResponseDetailsVM>>
    {
        return this._baseService.post<StandartResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Media.DeleteMedia, {id: mediaId});                
    }
}
