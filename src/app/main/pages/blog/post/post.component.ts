import { PostVM } from './../../../models/blog/PostVM';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { PostService } from 'app/main/services/post.service';

@Component({
    selector     : 'blog-post',
    templateUrl  : './post.component.html',
    styleUrls    : ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PostComponent implements OnInit, OnDestroy
{
    post: PostVM;
    pageType: string;
    postForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PostService} _postService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _postService: PostService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.post = new PostVM({});

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
        // Subscribe to update post on changes
        this._postService.onPostChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(post => {

                if ( post )
                {
                    this.post = new PostVM(post);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.post = new PostVM({});
                }

                this.postForm = this.createPostForm();
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
     * Create post form
     *
     * @returns {FormGroup}
     */
    createPostForm(): FormGroup
    {
        return this._formBuilder.group({
            id              : [this.post.id],
            title           : [this.post.title],
            content         : [this.post.content]
        });
    }

    /**
     * Save post
     */
    savePost(): void
    {
        const data = this.postForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._postService.savePost(data)
            .then(() => {

                // Trigger the subscription with new data
                this._postService.onPostChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Yazı kaydedildi', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    /**
     * Add post
     */
    addPost(): void
    {
        const data = this.postForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._postService.savePost(data)
            .then(() => {

                // Trigger the subscription with new data
                this._postService.onPostChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Yazı eklendi', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go('main/pages/blog/posts/' + this.post.id);
            });
    }
}
