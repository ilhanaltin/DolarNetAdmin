import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FileManagerService } from '../../../services/file-manager.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
    selector     : 'file-list',
    templateUrl  : './file-list.component.html',
    styleUrls    : ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy
{
    files: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['icon', 'fileName', 'fileTypeName', 'size', 'detail-button'];
    selected: any;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService
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
        this.dataSource = new FilesDataSource(this._fileManagerService, this.paginator);

        this._fileManagerService.onFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(files => {
                this.files = files;
            });

        this._fileManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
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
     * On select
     *
     * @param selected
     */
    onSelect(selected): void
    {
        this._fileManagerService.onFileSelected.next(selected);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    /**
     * After init
     */
    ngAfterViewInit()
    {
        this.paginator.page
            .pipe(
                tap(() => {
                    this._fileManagerService.onPagingChanged.next(this.paginator)
                })
            ).subscribe();
    }
}

export class FilesDataSource extends DataSource<any>
{
    filteredDataCount: number;

    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
    constructor(private _fileManagerService: FileManagerService,
        private _matPaginator: MatPaginator
    )
    {
        super();

        this.filteredDataCount = _fileManagerService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._fileManagerService.onFilesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
