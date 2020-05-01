import { ContactVM } from './../../../../models/authentication/ContactVM';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector     : 'contact-message-details-form-dialog',
    templateUrl  : './contact-message-details-form.component.html',
    styleUrls    : ['./contact-message-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactMessageDetailsFormDialogComponent
{
    action: string;
    contactData: ContactVM;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactMessageDetailsFormDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactMessageDetailsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.contactData = _data.contactMessage;
        this.dialogTitle = 'İletişim Mesajı Detayı';
    }
}