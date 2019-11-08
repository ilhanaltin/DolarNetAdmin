import { PagingVM } from './../../../models/PagingVM';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap, map, catchError, tap } from 'rxjs/operators';
import {merge, of as observableOf} from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsersService } from 'app/main/services/users.service';
import { UsersUserFormDialogComponent } from 'app/main/pages/users/user-form/user-form.component';
import { UserVM } from 'app/main/models/user/UserVM';
import {MatPaginator} from '@angular/material/paginator';
import { UserListResponseDetailsVM } from 'app/main/models/user/UserListResponseDetailsVM';

@Component({
    selector     : 'users-user-list',
    templateUrl  : './user-list.component.html',
    styleUrls    : ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UsersUserListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    dialogContent: TemplateRef<any>;

    users: UserVM[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'nickName','email', 'roleName', 'statusName', 'buttons'];
    selectedUsers: UserVM[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _usersService: UsersService,
        public _matDialog: MatDialog
    )
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
        this.dataSource = new FilesDataSource(this._usersService);

        this._usersService.onUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(users => {
                this.users = users;

                this.checkboxes = {};

                for(let i = 0; i< this.users.length; i++){
                    this.checkboxes[this.users[i].id] = false;
                }
                
                /*this.users.map(user => {
                    this.checkboxes[user.id] = false;
                });*/
            });

        this._usersService.onSelectedUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsers => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedUsers.includes(id);
                }
                this.selectedUsers = selectedUsers;
            });

        /*/this._usersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });*/

        this._usersService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._usersService.deselectUsers();
            });

        this._usersService.onPagingCalculated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(paging => {
                this.dataSource.filteredDataCount = paging.totalCount;
            });
    }

    /**
     * After init
     */
    ngAfterViewInit()
    {
        this.paginator.page
            .pipe(
                tap(() => {
                    this._usersService.onPagingChanged.next(this.paginator)
                })
            ).subscribe();
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
     * Edit user
     *
     * @param user
     */
    editUser(user): void
    {
        this.dialogRef = this._matDialog.open(UsersUserFormDialogComponent, {
            panelClass: 'user-form-dialog',
            data      : {
                user: user,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._usersService.updateUser(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteUser(user);

                        break;
                }
            });
    }

    /**
     * Delete User
     */
    deleteUser(user): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._usersService.deleteUser(user);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param userId
     */
    onSelectedChange(userId): void
    {
        this._usersService.toggleSelectedUser(userId);
    }

    /**
     * Toggle star
     *
     * @param userId
     */
    toggleStar(userId): void
    {
        /*if ( this.user.starred.includes(userId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(userId), 1);
        }
        else
        {
            this.user.starred.push(userId);
        }

        this._usersService.updateUserData(this.user);*/
    }    
}

export class FilesDataSource extends DataSource<any>
{
    filteredDataCount: number;
    
    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     */
    constructor(
        private _usersService: UsersService
    )
    {
        super();
        this.filteredDataCount = _usersService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._usersService.onUsersChanged;
    }

    // Filtered data
    get filteredData(): any
    {
        return this.filteredDataCount;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }    
}