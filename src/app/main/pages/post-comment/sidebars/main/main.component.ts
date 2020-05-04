import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'app/main/services/authentication.service';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { PostCommentService } from 'app/main/services/post-comment.service';

@Component({
    selector   : 'post-comments-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class PostCommentsMainSidebarComponent implements OnInit, OnDestroy
{
    postComment: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PostCommentsService} _postCommentsService
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _postCommentService: PostCommentService, private _authenticationService: AuthenticationService)
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
        if ( this._postCommentService.filterBy === GlobalConstants.CommentStausType.Waiting )
        {
            this.filterBy = 'waiting';
        }
        else  if ( this._postCommentService.filterBy === GlobalConstants.CommentStausType.Approved )
        {
            this.filterBy = 'approved';
        }
        else  if ( this._postCommentService.filterBy === GlobalConstants.CommentStausType.Trash )
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
            this._postCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Waiting);
        }
        else  if ( this.filterBy === 'approved' )
        {
            this._postCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Approved);
        }
        else  if ( this.filterBy === 'trash' )
        {
            this._postCommentService.onFilterChanged.next(GlobalConstants.CommentStausType.Trash);
        }
        else
        {
            this._postCommentService.onFilterChanged.next(-1);
        }
    }
}