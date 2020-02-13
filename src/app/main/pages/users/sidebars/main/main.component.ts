import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from 'app/main/services/users.service';
import { AuthenticationService } from 'app/main/services/authentication.service';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';

@Component({
    selector   : 'users-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class UsersMainSidebarComponent implements OnInit, OnDestroy
{
    user: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _usersService: UsersService, public _authenticationService: AuthenticationService)
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        if ( this._usersService.filterBy === GlobalConstants.UserRoles.Editor )
        {
            this.filterBy = 'editors';
        }
        else  if ( this._usersService.filterBy === GlobalConstants.UserRoles.Admin )
        {
            this.filterBy = 'admins';
        }
        else  if ( this._usersService.filterBy === GlobalConstants.UserRoles.User )
        {
            this.filterBy = 'users';
        }
        else
        {
            this.filterBy = 'all';
        }

        this._usersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;

        if ( this.filterBy === 'editors' )
        {
            this._usersService.onFilterChanged.next(GlobalConstants.UserRoles.Editor);
        }
        else  if ( this.filterBy === 'admins' )
        {
            this._usersService.onFilterChanged.next(GlobalConstants.UserRoles.Admin);
        }
        else  if ( this.filterBy === 'users' )
        {
            this._usersService.onFilterChanged.next(GlobalConstants.UserRoles.User);
        }
        else
        {
            this._usersService.onFilterChanged.next(-1);
        }
    }
}