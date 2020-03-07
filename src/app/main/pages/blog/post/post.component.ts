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
import { TypeVM } from 'app/main/models/TypeVM';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';

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
    categoryList: TypeVM[];
    statusList : TypeVM[];
    imageChanged: boolean;

    readonly _globalConstants = GlobalConstants;

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
        this.imageChanged = false;

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
            longTitle       : [this.post.longTitle, Validators.required],
            tags            : [this.post.tags],
            content         : [this.post.content, Validators.required],
            authorId        : [currentUser.id],
            publishDate     : [this.post.publishDate],
            isSliderPost    : [this.post.isSliderPost],
            categoryIds     : [this.post.categoryIds, Validators.required],
            statusTypeId    : [this.post.statusTypeId, Validators.required],
            mainImage       : [this.post.mainImage],
            imagePath       : [this.post.imagePath]
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

        this._postService.savePost(data)
            .then(() => {

                // Trigger the subscription with new data
                //this._postService.onPostChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Yazı eklendi', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                this.pageType = "edit";

                // Change the location with new one
                //this._location.go('main/pages/blog/posts/' + this.post.id);
            });
    }

    onFileChanged(event) {

        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.postForm.get('mainImage').setValue(reader.result as string);
                this.post.mainImage = reader.result;
                this.imageChanged = true;
            };
        }
      }

      getCategoryList() {
        let categoryArray: TypeVM[] = [];
    
        GlobalConstants.PostCategories.forEach(function(value, index){
          let category = new TypeVM();
          category.adi = value;
          category.id = index + 1;
          categoryArray.push(category);
       });
    
        return categoryArray;
      }

      getStatusList() {
        let statusArray: TypeVM[] = [];
    
        GlobalConstants.PostStatus.forEach(function(value, index){
          let status = new TypeVM();
          status.adi = value;
          status.id = index + 1;
          statusArray.push(status);
       });
    
        return statusArray;
      }

      getImage()
      {
          return (this.post.mainImage === '' || this.post.mainImage == null) ? this.post.imagePath : this.post.mainImage; 
      }
}
