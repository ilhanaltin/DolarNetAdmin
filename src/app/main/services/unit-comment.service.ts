import { PagingVM } from '../models/PagingVM';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { apiConfig } from 'app/fuse-config/api.config';
import { ServiceResult } from '../models/ServiceResult';
import { StandartResponseDetailsVM } from '../models/StandartResponseDetailsVM';
import { UnitCommentListResponseDetailsVM } from '../models/analysis/UnitCommentListResponseDetailsVM';

@Injectable()
export class UnitCommentService implements Resolve<any>
{
    onUnitCommentsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

    unitComments: any[];

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
        this.onUnitCommentsChanged = new BehaviorSubject([]);
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
                this.getUnitComments()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUnitComments();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUnitComments();
                    });

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getUnitComments();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get unitComments
     *
     * @returns {Promise<any>}
     */
    getUnitComments(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString())
                .append('StatusId', this.filterBy.toString());

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Currency.GetComments, myParams)
                    .subscribe((response: any) => {

                        let result = response as ServiceResult<UnitCommentListResponseDetailsVM>;
                        this.pagingVM = result.result.pagingVM;

                        this.unitComments = result.result.unitCommentList;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.unitComments = FuseUtils.filterArrayByString(this.unitComments, this.searchText);
                        }

                        this.onUnitCommentsChanged.next(this.unitComments);
                        this.onPagingCalculated.next(this.pagingVM);
                        resolve(this.unitComments);

                    }, reject);
            }
        );
    }  
    
    updateStatus(status): Observable<ServiceResult<StandartResponseDetailsVM>>
    {
        return this._baseService.post<StandartResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Currency.CommentStatusUpdate, status);                
    }

    deleteStatus(commentId): Observable<ServiceResult<StandartResponseDetailsVM>>
    {
        return this._baseService.post<StandartResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Currency.DeleteComment, {id: commentId});                
    }
}