import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { LogVM } from 'app/main/models/audit/LogVM';
import {MatPaginator} from '@angular/material/paginator';
import { AuditService } from 'app/main/services/audit.service';

@Component({
    selector     : 'logs-log-list',
    templateUrl  : './log-list.component.html',
    styleUrls    : ['./log-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LogsLogListComponent implements OnInit, OnDestroy
{
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    dialogContent: TemplateRef<any>;

    logs: LogVM[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['logTypeAdi','actionTypeAdi','crudTypeAdi', 'detail'];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {LogsService} _logsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _logsService: AuditService,
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
        this.dataSource = new FilesDataSource(this._logsService);

        this._logsService.onLogsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(logs => {
                this.logs = logs;
            });
        
        this._logsService.onPagingCalculated
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
                    this._logsService.onPagingChanged.next(this.paginator)
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
}

export class FilesDataSource extends DataSource<any>
{
    filteredDataCount: number;
    
    /**
     * Constructor
     *
     * @param {AuditService} _auditService
     */
    constructor(
        private _auditService: AuditService
    )
    {
        super();
        this.filteredDataCount = _auditService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._auditService.onLogsChanged;
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