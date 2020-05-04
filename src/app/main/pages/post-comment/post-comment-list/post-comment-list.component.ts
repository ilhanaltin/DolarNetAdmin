import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { MatPaginator } from '@angular/material/paginator';
import { PostCommentVM } from 'app/main/models/blog/PostCommentVM';
import { PostCommentService } from 'app/main/services/post-comment.service';
import { PostCommentDetailsFormDialogComponent } from '../post-comment-details-form/post-comment-details-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';

@Component({
    selector     : 'post-comment-list',
    templateUrl  : './post-comment-list.component.html',
    styleUrls    : ['./post-comment-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PostCommentListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    dialogContent: TemplateRef<any>;

    postComments: PostCommentVM[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['statusTypeName', 'userName','userNickName','email','postTitle', 'comment', 'buttons'];
    dialogRef: any;

    filterBy: number = -1;

    readonly _globalConstants = GlobalConstants;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PostCommentService} _postCommentService
     * @param {MatDialog} _matDialog
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _postCommentService: PostCommentService,
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
        this.dataSource = new FilesDataSource(this._postCommentService);

        this._postCommentService.onPostCommentsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(postComments => {
                this.postComments = postComments;
            });
        
        this._postCommentService.onPagingCalculated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(paging => {
                this.dataSource.filteredDataCount = paging.totalCount;
            });

        this._postCommentService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(filter => {
                this.filterBy = filter;

                this.displayedColumns = ['statusTypeName', 'userName','userNickName','email','postTitle', 'comment', 'buttons'];
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
                    this._postCommentService.onPagingChanged.next(this.paginator)
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
     * Post Comment Detail
     *
     * @param postComment
     */
    postCommentDetail(postComment): void
    {
        this.dialogRef = this._matDialog.open(PostCommentDetailsFormDialogComponent, {
            //panelClass: 'audit-details-form-dialog',
            data      : {
                postComment: postComment,
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

                    this._postCommentService.getPostComments();
                }
            });
    }

    /**
     * Post Comment Detail
     *
     * @param postComment
     */
    deleteComment(postComment): void
    {
        console.log(postComment);

        this._postCommentService.deleteStatus(postComment.id)
            .subscribe(result=>{
                if(result.status == 200)
                {
                    this._matSnackBar.open('İşlem Başarılı', 'OK', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });
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
     * @param {PostCommentService} _postCommentService
     */
    constructor(
        private _postCommentService: PostCommentService
    )
    {
        super();
        this.filteredDataCount = _postCommentService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._postCommentService.onPostCommentsChanged
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