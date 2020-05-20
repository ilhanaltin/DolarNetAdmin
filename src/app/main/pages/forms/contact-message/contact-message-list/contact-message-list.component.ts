import { ContactMessageService } from './../../../../services/contact-message.service';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import {MatPaginator} from '@angular/material/paginator';
import { ContactMessageDetailsFormDialogComponent } from '../contact-message-details-form/contact-message-details-form.component';
import { ContactVM } from 'app/main/models/authentication/ContactVM';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector     : 'contact-message-list',
    templateUrl  : './contact-message-list.component.html',
    styleUrls    : ['./contact-message-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactMessageListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    
    dialogContent: TemplateRef<any>;

    contactMessages: ContactVM[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['nameSurname','email','gsm', 'message', 'buttons'];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactMessageService} _contactMessageService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactMessageService: ContactMessageService,
        public _matDialog: MatDialog
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
        this.dataSource = new FilesDataSource(this._contactMessageService);

        this._contactMessageService.onContactMessagesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contactMessages => {
                this.contactMessages = contactMessages;
            });
        
        this._contactMessageService.onPagingCalculated
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
                    this._contactMessageService.onPagingChanged.next(this.paginator)
                })
            ).subscribe();
    }

    /**
     * Delete Message
     */
    deleteMessage(message): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._contactMessageService.deleteMessage(message);
            }
            this.confirmDialogRef = null;
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
     * Contact Message Detail
     *
     * @param contactMessage
     */
    contactMessageDetail(contactMessage): void
    {
        this.dialogRef = this._matDialog.open(ContactMessageDetailsFormDialogComponent, {
            //panelClass: 'audit-details-form-dialog',
            data      : {
                contactMessage: contactMessage,
                action : 'detail'
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
     * @param {ContactMessageService} _contactMessageService
     */
    constructor(
        private _contactMessageService: ContactMessageService
    )
    {
        super();
        this.filteredDataCount = _contactMessageService.pagingVM.totalCount;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._contactMessageService.onContactMessagesChanged;
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