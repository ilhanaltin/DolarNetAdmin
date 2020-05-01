import { PagingVM } from '../models/PagingVM';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { apiConfig } from 'app/fuse-config/api.config';
import { ServiceResult } from '../models/ServiceResult';
import { ContactListResponseDetailsVM } from '../models/authentication/ContactListResponseDetailsVM';

@Injectable()
export class ContactMessageService implements Resolve<any>
{
    onContactMessagesChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

    contactMessages: any[];

    searchText: string;

    pagingVM = new PagingVM({});

    /**
     * Constructor
     *
     * @param {BaseService} _baseService
     */
    constructor(private _baseService: BaseService)
    {
        // Set the defaults
        this.onContactMessagesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
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
                this.getContactMessages()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContactMessages();
                    });

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getContactMessages();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get contact messages
     *
     * @returns {Promise<any>}
     */
    getContactMessages(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString());

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.User.ContactList, myParams)
                    .subscribe((response: any) => {

                        let result = response as ServiceResult<ContactListResponseDetailsVM>;
                        this.pagingVM = result.result.pagingVM;

                        this.contactMessages = result.result.contactList;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contactMessages = FuseUtils.filterArrayByString(this.contactMessages, this.searchText);
                        }

                        this.onContactMessagesChanged.next(this.contactMessages);
                        this.onPagingCalculated.next(this.pagingVM);
                        resolve(this.contactMessages);

                    }, reject);
            }
        );
    }        
}