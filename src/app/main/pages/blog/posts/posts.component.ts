import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { PostsService } from '../../../services/posts.service';

@Component({
    selector     : 'blog-posts',
    templateUrl  : './posts.component.html',
    styleUrls    : ['./posts.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['id', 'title', 'authorName', 'authorNickName', 'categoryTypeName', 'statusTypeName', 'feedbacks'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _postsService: PostsService
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
        this.dataSource = new FilesDataSource(this._postsService);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });

        this._postsService.onPagingCalculated
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
                    this._postsService.onPagingChanged.next(this.paginator)
                })
            ).subscribe();
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    filteredDataCount: number;

    /**
     * Constructor
     *
     * @param {PostsService} _postsService
     */
    constructor(
        private _postsService: PostsService
    )
    {
        super();

        this.filteredData = this._postsService.posts;
        this.filteredDataCount = _postsService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._postsService.onPostsChanged;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
