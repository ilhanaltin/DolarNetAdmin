import { PagingVM } from '../models/PagingVM';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { apiConfig } from 'app/fuse-config/api.config';
import { ServiceResult } from '../models/ServiceResult';
import { LogListResponseDetailsVM } from '../models/audit/LogListResponseDetailsVM';

@Injectable()
export class AuditService implements Resolve<any>
{
    onLogsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

    logs: any[];

    searchText: string;
    filterBy: number = -1;

    pagingVM = new PagingVM({});

    /**
     * Constructor
     *
     * @param {BaseService} _baseService
     */
    constructor(private _baseService: BaseService)
    {
        // Set the defaults
        this.onLogsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onPagingChanged = new Subject();
        this.onPagingCalculated = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getLogs()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getLogs();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getLogs();
                    });

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getLogs();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get logs
     *
     * @returns {Promise<any>}
     */
    getLogs(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString())
                .append('TypeId', this.filterBy.toString());

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Audit.GetAll, myParams)
                    .subscribe((response: any) => {

                        let result = response as ServiceResult<LogListResponseDetailsVM>;
                        this.pagingVM = result.result.pagingVM;

                        this.logs = result.result.logList;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.logs = FuseUtils.filterArrayByString(this.logs, this.searchText);
                        }

                        this.onLogsChanged.next(this.logs);
                        this.onPagingCalculated.next(this.pagingVM);
                        resolve(this.logs);

                    }, reject);
            }
        );
    }        
}
