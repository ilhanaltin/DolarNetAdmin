import { LogVM } from './../../../models/Audit/LogVM';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector     : 'audit-details-form-dialog',
    templateUrl  : './audit-details-form.component.html',
    styleUrls    : ['./audit-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AuditDetailsFormDialogComponent
{
    action: string;
    logData: LogVM;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AuditDetailsFormDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AuditDetailsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.logData = _data.log;
        this.dialogTitle = 'Log Detayı';
    }
}