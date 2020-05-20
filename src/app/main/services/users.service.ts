import { PagingVM } from './../models/PagingVM';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { apiConfig } from 'app/fuse-config/api.config';
import { ServiceResult } from '../models/ServiceResult';
import { UserListResponseDetailsVM } from '../models/user/UserListResponseDetailsVM';

@Injectable()
export class UsersService implements Resolve<any>
{
    onUsersChanged: BehaviorSubject<any>;
    onSelectedUsersChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPagingChanged: Subject<any>;
    onPagingCalculated: Subject<any>;

    users: any[];
    selectedUsers: number[] = [];

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
        this.onUsersChanged = new BehaviorSubject([]);
        this.onSelectedUsersChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
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
                this.getUsers(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUsers();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUsers();
                    });

                    this.onPagingChanged.subscribe(paging => {
                        this.pagingVM.currentPage = paging.pageIndex;
                        this.pagingVM.pageItemCount = paging.pageSize;
                        this.getUsers();
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let myParams = new HttpParams()
                .append('ItemCount', this.pagingVM.pageItemCount.toString())
                .append('PageId', this.pagingVM.currentPage.toString())
                .append('RoleId', this.filterBy.toString());

                this._baseService.get(apiConfig.Api.Main.Url + apiConfig.Services.User.GetAllUser, myParams)
                    .subscribe((response: any) => {

                        let result = response as ServiceResult<UserListResponseDetailsVM>;
                        this.pagingVM = result.result.pagingVM;

                        this.users = result.result.userList;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.users = FuseUtils.filterArrayByString(this.users, this.searchText);
                        }

                        this.onUsersChanged.next(this.users);
                        this.onPagingCalculated.next(this.pagingVM);
                        resolve(this.users);

                    }, reject);
            }
        );
    }

    /**
     * Toggle selected user by id
     *
     * @param id
     */
    toggleSelectedUser(id): void
    {
        // First, check if we already have that user as selected...
        if ( this.selectedUsers.length > 0 )
        {
            const index = this.selectedUsers.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedUsers.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsersChanged.next(this.selectedUsers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsers.push(id);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedUsers.length > 0 )
        {
            this.deselectUsers();
        }
        else
        {
            this.selectUsers();
        }
    }

    /**
     * Select users
     *
     * @param filterParameter
     * @param filterValue
     */
    selectUsers(filterParameter?, filterValue?): void
    {
        this.selectedUsers = [];

        // If there is no filter, select all users
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedUsers = [];
            this.users.map(user => {
                this.selectedUsers.push(user.id);
            });
        }

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Update user
     *
     * @param user
     * @returns {Promise<any>}
     */
    updateUser(user): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.User.UpdateUser, {...user})
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                });
        });
    }

    /**
     * Save new user
     *
     * @param user
     * @returns {Promise<any>}
     */
    saveUser(user): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.User.Register, {...user})
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect users
     */
    deselectUsers(): void
    {
        this.selectedUsers = [];

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Delete user
     *
     * @param user
     */
    deleteUser(user): void
    {
        this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.User.DeleteUser, {id: user.id})
        .subscribe(result=>{
            const userIndex = this.users.indexOf(user);
            this.users.splice(userIndex, 1);
            this.onUsersChanged.next(this.users);
            
            this.getUsers();
         });
    }

    /**
     * Delete selected users
     */
    deleteSelectedUsers(): void
    {
        for ( const userId of this.selectedUsers )
        {
            const user = this.users.find(_user => {
                return _user.id === userId;
            });
            const userIndex = this.users.indexOf(user);
            this.users.splice(userIndex, 1);
        } 
        this.onUsersChanged.next(this.users);

        this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.User.DeleteSelected, {ids: this.selectedUsers})
        .subscribe(result=>{
            this.getUsers();
         });

        this.deselectUsers();
    }
}