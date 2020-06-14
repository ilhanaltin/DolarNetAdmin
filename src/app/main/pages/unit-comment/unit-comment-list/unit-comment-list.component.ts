import { UnitCommentDetailsFormDialogComponent } from './../unit-comment-details-form/unit-comment-details-form.component';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { UnitCommentVM } from 'app/main/models/analysis/UnitCommentVM';
import { UnitCommentService } from 'app/main/services/unit-comment.service';

@Component({
    selector     : 'unit-comment-list',
    templateUrl  : './unit-comment-list.component.html',
    styleUrls    : ['./unit-comment-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UnitCommentListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    dialogContent: TemplateRef<any>;

    unitComments: UnitCommentVM[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['statusTypeName', 'userName','userNickName','email','code', 'comment', 'buttons'];
    dialogRef: any;

    filterBy: number = -1;

    readonly _globalConstants = GlobalConstants;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UnitCommentService} _unitCommentService
     * @param {MatDialog} _matDialog
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _unitCommentService: UnitCommentService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
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
        this.dataSource = new FilesDataSource(this._unitCommentService);

        this._unitCommentService.onUnitCommentsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(unitComments => {
                this.unitComments = unitComments;
            });
        
        this._unitCommentService.onPagingCalculated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(paging => {
                this.dataSource.filteredDataCount = paging.totalCount;
            });

        this._unitCommentService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(filter => {
                this.filterBy = filter;

                this.displayedColumns = ['statusTypeName', 'userName','userNickName','email','code', 'comment', 'buttons'];
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
                    this._unitCommentService.onPagingChanged.next(this.paginator)
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
     * Unit Comment Detail
     *
     * @param unitComment
     */
    unitCommentDetail(unitComment): void
    {
        this.dialogRef = this._matDialog.open(UnitCommentDetailsFormDialogComponent, {
            //panelClass: 'audit-details-form-dialog',
            data      : {
                unitComment: unitComment,
                action : 'detail'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if(response){
                    // Show the success message
                    this._matSnackBar.open('İşlem Başarılı', 'OK', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });

                    this._unitCommentService.getUnitComments();
                }
            });
    }

    /**
     * Unit Comment Detail
     *
     * @param unitComment
     */
    deleteComment(unitComment): void
    {
        this._unitCommentService.deleteStatus(unitComment.id)
            .subscribe(result=>{
                if(result.status == 200)
                {
                    this._matSnackBar.open('İşlem Başarılı', 'OK', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });

                    this._unitCommentService.getUnitComments();
                }
            });
    }
}

export class FilesDataSource extends DataSource<any>
{
    filteredDataCount: number;
    
    /**
     * Constructor
     *
     * @param {UnitCommentService} _unitCommentService
     */
    constructor(
        private _unitCommentService: UnitCommentService
    )
    {
        super();
        this.filteredDataCount = _unitCommentService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._unitCommentService.onUnitCommentsChanged
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