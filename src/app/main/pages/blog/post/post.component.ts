import { MediaVM } from './../../../models/media/MediaVM';
import { UserVM } from './../../../models/user/UserVM';
import { PostVM } from './../../../models/blog/PostVM';
import { Component, OnDestroy, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { PostService } from 'app/main/services/post.service';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TypeVM } from 'app/main/models/TypeVM';
import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { ChangeEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';
import { FileManagerService } from 'app/main/services/file-manager.service';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { Moment } from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;
const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
    selector     : 'blog-post',
    templateUrl  : './post.component.html',
    styleUrls    : ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      ],
})
export class PostComponent implements OnInit, OnDestroy
{
    public Editor = ClassicEditor;

    post: PostVM;
    pageType: string;
    postForm: FormGroup;
    categoryList: TypeVM[];
    statusList : TypeVM[];
    imageChanged: boolean;
    isClickedOnceAdd: boolean = false;
    isClickedOnceUpdate: boolean = false;
    _editor: any;

    stateCtrl = new FormControl();
    stateCtrlMainImage = new FormControl();
    filteredMedias: Observable<MediaVM[]>;

    mediaList: MediaVM[];
    selectedMedia:MediaVM;
    selectedMediaValue:string;
    selectedMediaForSlider:MediaVM;    

    date = new FormControl(moment());

    imageFilterMonth: number;
    imageFilterYear: number;

    readonly _globalConstants = GlobalConstants;

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
        private _fileManagerService: FileManagerService,
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
        
        this.imageFilterYear = (new Date()).getFullYear();
        this.imageFilterMonth = (new Date()).getMonth();
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

            if (post)
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

            this.getImages();
        });                     
    }

    getImages()
    {
        console.log("call getFilesForListControl");

        this._fileManagerService.getFilesForListControl(this.imageFilterMonth + 1, this.imageFilterYear)
        .subscribe(result => {
            this.mediaList = result.result.mediaList;

            this.filteredMedias = this.stateCtrl.valueChanges
            .pipe(
                startWith(''),
                map(media => media ? this._filterStates(media) : this.mediaList.slice())
            );
        });
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);

        this.imageFilterYear = normalizedYear.year();
      }
    
      chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();

        this.imageFilterMonth = normalizedMonth.month();
        console.log("call images");

        this.getImages();
      }

    private _filterStates(value: string): MediaVM[] {
        const filterValue = value.toLowerCase();

        return this.mediaList.filter(state => state.fileName.toLowerCase().indexOf(filterValue) === 0);
    }

    public onBlur( { editor }: BlurEvent ) {
        this._editor = editor;
    }

    setSelectedMedia(value,index)
    {
        this.selectedMedia = value;
    }

    setSelectedMediaForSlider(value: MediaVM,index)
    {
        this.selectedMediaForSlider = value;
        this.post.imagePath = value.filePath;
    }

    addImageToPost()
    {
        if(this.selectedMedia === null || this.selectedMedia.filePath === "")
            return;

        let imgSrc = `<img src="${this.selectedMedia.filePath}" alt="${this.post.title}">`;
        const viewFragment = this._editor.data.processor.toView(imgSrc);    
        const modelFragment = this._editor.data.toModel(viewFragment);    
        this._editor.model.insertContent(modelFragment, this._editor.model.document.selection);
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
            pageDescription : [this.post.pageDescription, Validators.required],
            tags            : [this.post.tags],
            content         : [this.post.content, Validators.required],
            authorId        : [currentUser.id],
            publishDate     : [this.post.publishDate],
            isSliderPost    : [this.post.isSliderPost],
            categoryIds     : [this.post.categoryIds, Validators.required],
            statusTypeId    : [this.post.statusTypeId, Validators.required],
            imagePath       : [this.post.imagePath],
            dateFilterImg   : [new FormControl(moment())]
        });
    }

    /**
     * Save post
     */
    savePost(): void
    {
        const data = this.postForm.getRawValue();
        
        data.imagePath = this.post.imagePath;

        this._postService.savePost(data)
        .then(() => {

            // Trigger the subscription with new data
            this._postService.onPostChanged.next(data);

            this.isClickedOnceUpdate = false;
            this.imageChanged = false;

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

        data.imagePath = this.post.imagePath;

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
            this.isClickedOnceAdd = false;
            this.imageChanged = false;
            
            // Change the location with new one
            //this._location.go('main/pages/blog/posts/' + this.post.id);
        });
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
        if (this.post.imagePath === "")
        {
            return "";
        }

        return this.post.imagePath;
    }
}
