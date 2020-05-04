import { PostCommentListResponseDetailsVM } from '../models/blog/PostCommentListResponseDetailsVM';
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

@Injectable()
export class PostCommentService implements Resolve<any>
{
    onPostCommentsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

    postComments: any[];

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
        this.onPostCommentsChanged = new BehaviorSubject([]);
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
                this.getPostComments()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getPostComments();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getPostComments();
                    });

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getPostComments();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get postComments
     *
     * @returns {Promise<any>}
     */
    getPostComments(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString())
                .append('StatusId', this.filterBy.toString());

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Blog.GetComments, myParams)
                    .subscribe((response: any) => {

                        let result = response as ServiceResult<PostCommentListResponseDetailsVM>;
                        this.pagingVM = result.result.pagingVM;

                        this.postComments = result.result.postCommentList;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.postComments = FuseUtils.filterArrayByString(this.postComments, this.searchText);
                        }

                        this.onPostCommentsChanged.next(this.postComments);
                        this.onPagingCalculated.next(this.pagingVM);
                        resolve(this.postComments);

                    }, reject);
            }
        );
    }  
    
    updateStatus(status): Observable<ServiceResult<StandartResponseDetailsVM>>
    {
        return this._baseService.post<StandartResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Blog.CommentStatusUpdate, status);                
    }

    deleteStatus(commentId): Observable<ServiceResult<StandartResponseDetailsVM>>
    {
        return this._baseService.post<StandartResponseDetailsVM>(apiConfig.Api.Main.Url + apiConfig.Services.Blog.DeleteComment, {id: commentId});                
    }
}
