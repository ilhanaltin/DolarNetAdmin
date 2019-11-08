import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuditService } from 'app/main/services/audit.service';
import { AuthenticationService } from 'app/main/services/authentication.service';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';

@Component({
    selector   : 'logs-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class LogsMainSidebarComponent implements OnInit, OnDestroy
{
    log: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {LogsService} _logsService
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _auditService: AuditService, private _authenticationService: AuthenticationService)
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
        if ( this._auditService.filterBy === GlobalConstants.LogType.Error )
        {
            this.filterBy = 'error';
        }
        else  if ( this._auditService.filterBy === GlobalConstants.LogType.Action )
        {
            this.filterBy = 'action';
        }
        else  if ( this._auditService.filterBy === GlobalConstants.LogType.DbOperation )
        {
            this.filterBy = 'dboperation';
        }
        else
        {
            this.filterBy = 'all';
        }
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

        if ( this.filterBy === 'error' )
        {
            this._auditService.onFilterChanged.next(GlobalConstants.LogType.Error);
        }
        else  if ( this.filterBy === 'action' )
        {
            this._auditService.onFilterChanged.next(GlobalConstants.LogType.Action);
        }
        else  if ( this.filterBy === 'dboperation' )
        {
            this._auditService.onFilterChanged.next(GlobalConstants.LogType.DbOperation);
        }
        else
        {
            this._auditService.onFilterChanged.next(-1);
        }
    }
}
