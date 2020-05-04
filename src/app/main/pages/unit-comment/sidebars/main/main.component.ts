import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'app/main/services/authentication.service';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { UnitCommentService } from 'app/main/services/unit-comment.service';

@Component({
    selector   : 'unit-comments-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class UnitCommentsMainSidebarComponent implements OnInit, OnDestroy
{
    unitComment: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UnitCommentsService} _unitCommentsService
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _unitCommentService: UnitCommentService, private _authenticationService: AuthenticationService)
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
        if ( this._unitCommentService.filterBy === GlobalConstants.CommentStausType.Waiting )
        {
            this.filterBy = 'waiting';
        }
        else  if ( this._unitCommentService.filterBy === GlobalConstants.CommentStausType.Approved )
        {
            this.filterBy = 'approved';
        }
        else  if ( this._unitCommentService.filterBy === GlobalConstants.CommentStausType.Trash )
        {
            this.filterBy = 'trash';
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

        if ( this.filterBy === 'waiting' )
        {
            this._unitCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Waiting);
        }
        else  if ( this.filterBy === 'approved' )
        {
            this._unitCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Approved);
        }
        else  if ( this.filterBy === 'trash' )
        {
            this._unitCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Trash);
        }
        else
        {
            this._unitCommentService.onFilterChanged.next(-1);
        }
    }
}