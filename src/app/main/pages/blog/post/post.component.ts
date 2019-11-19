import { UserVM } from './../../../models/user/UserVM';
import { PostVM } from './../../../models/blog/PostVM';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { PostService } from 'app/main/services/post.service';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    categoryList = [];
    statusList = [];

    public Editor = ClassicEditor;

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

        this.categoryList = this.getCategoryList();
        this.statusList = this.getStatusList();
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
        let currentUser = JSON.parse(localStorage.getItem("current-user")) as UserVM;

        return this._formBuilder.group({
            id              : [this.post.id],
            title           : [this.post.title, Validators.required],
            content         : [this.post.content, Validators.required],
            authorId        : [currentUser.id],
            categoryTypeId  : [this.post.categoryTypeId, Validators.required],
            statusTypeId    : [this.post.statusTypeId, Validators.required]
        });
    }

    /**
     * Save post
     */
    savePost(): void
    {
        const data = this.postForm.getRawValue();

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

    getCategoryList() {
        return [
            { id: 1, name: "Döviz" },
            { id: 2, name: "Altın" },
            { id: 3, name: "Pariteler" },
            { id: 4, name: "Kripto" },
            { id: 5, name: "Paralar" },
            { id: 6, name: "Borsa" },
            { id: 7, name: "Gündem" }
        ];
      }

      getStatusList() {
        return [
            { id: 1, name: "Taslak" },
            { id: 2, name: "Yayınlandı" }
        ];
      }
}
