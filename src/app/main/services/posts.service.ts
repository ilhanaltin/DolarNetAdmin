import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

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
        this.onPagingChanged = new Subject();
        this.onPagingCalculated = new Subject();
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

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getPosts();
                    });

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
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString())
                .append('CategoryId', "-1");
                    
        return new Promise((resolve, reject) => {
            this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Blog.GetAll, myParams)
                .subscribe((response: any) => {

                    let result = response as ServiceResult<PostListResponseDetailsVM>;
                    this.pagingVM = result.result.pagingVM;
                    
                    this.posts = result.result.postList;

                    this.onPostsChanged.next(this.posts);
                    this.onPagingCalculated.next(this.pagingVM);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Delete post
     *
     * @param post
     */
    deletePost(post): void
    {
        this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.Blog.Delete, {id: post.id})
        .subscribe(result=>{
            const postIndex = this.posts.indexOf(post);
            this.posts.splice(postIndex, 1);
            this.onPostsChanged.next(this.posts);

            this.getPosts();
         });
    }
}
