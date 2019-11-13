import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { apiConfig } from 'app/fuse-config/api.config';
import { HttpParams } from '@angular/common/http';
import { ServiceResult } from '../models/ServiceResult';
import { PostListResponseDetailsVM } from '../models/blog/PostListResponseDetailsVM';
import { PagingVM } from '../models/PagingVM';

@Injectable()
export class PostsService implements Resolve<any>
{
    posts: any[];
    pagingVM = new PagingVM({});

    onPostsChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _baseService: BaseService
    )
    {
        // Set the defaults
        this.onPostsChanged = new BehaviorSubject({});
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
                this.getPosts()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get posts
     *
     * @returns {Promise<any>}
     */
    getPosts(): Promise<any>
    {
        let myParams = new HttpParams()
                    .append('ItemCount', "10")
                    .append('PageId', "1")
                    .append('CategoryId', "-1");
                    
        return new Promise((resolve, reject) => {
            this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Blog.GetAll, myParams)
                .subscribe((response: any) => {

                    let result = response as ServiceResult<PostListResponseDetailsVM>;
                    this.pagingVM = result.result.pagingVM;
                    
                    this.posts = result.result.postList;

                    this.onPostsChanged.next(this.posts);
                    resolve(response);
                }, reject);
        });
    }
}
