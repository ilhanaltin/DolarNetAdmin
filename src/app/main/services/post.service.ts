import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { apiConfig } from 'app/fuse-config/api.config';
import { HttpParams } from '@angular/common/http';
import { ServiceResult } from '../models/ServiceResult';
import { PostResponseDetailsVM } from '../models/blog/PostResponseDetailsVM';

@Injectable()
export class PostService implements Resolve<any>
{
    routeParams: any;
    post: any;
    onPostChanged: BehaviorSubject<any>;

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
        this.onPostChanged = new BehaviorSubject({});
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
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getPost()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get post
     *
     * @returns {Promise<any>}
     */
    getPost(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onPostChanged.next(false);
                resolve(false);
            }
            else
            {
                let myParams = new HttpParams()
                    .append('id', this.routeParams.id);

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.Blog.GetById, myParams)
                    .subscribe((response: any) => {
                        let result = response as ServiceResult<PostResponseDetailsVM>;

                        this.post = result.result.post;
                        this.onPostChanged.next(this.post);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save post
     *
     * @param post
     * @returns {Promise<any>}
     */
    savePost(post): Promise<any>
    {
        console.log(post);

        return new Promise((resolve, reject) => {
            this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.Blog.Post, post)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
