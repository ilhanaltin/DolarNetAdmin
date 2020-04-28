import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { MediaVM } from './../../models/media/MediaVM';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FileManagerService } from '../../services/file-manager.service';
import { BaseService } from 'app/main/services/base.service';
import { apiConfig } from 'app/fuse-config/api.config';
import { StandartResponseDetailsVM } from 'app/main/models/StandartResponseDetailsVM';
import { ServiceResult } from 'app/main/models/ServiceResult';
import { UserVM } from 'app/main/models/user/UserVM';


@Component({
    selector     : 'file-manager',
    templateUrl  : './file-manager.component.html',
    styleUrls    : ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerComponent implements OnInit, OnDestroy
{
    selected: any;

    mediaFile: MediaVM = new MediaVM({});

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
        private _fuseSidebarService: FuseSidebarService,
        private _baseService: BaseService
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
        this._fileManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
            this.selected = selected;
        });
    }

    onFileChanged(event) {

        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.mediaFile.file = reader.result;
                this.mediaFile.fileName = file.name;

                let currentUser = JSON.parse(localStorage.getItem("current-user")) as UserVM;
                this.mediaFile.userId = currentUser.id;

                this._baseService.post(apiConfig.Api.Main.Url + apiConfig.Services.Media.Post, this.mediaFile)
                .subscribe((response: any) => {
                    let result = response as ServiceResult<StandartResponseDetailsVM>;

                    if(result.status === 200)
                    {
                        this._fileManagerService.getFiles();
                    }
                });
            };
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
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
