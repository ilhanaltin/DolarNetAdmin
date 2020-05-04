import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentStatusUpdateRequestVM } from 'app/main/models/blog/CommentStatusUpdateRequestVM';
import { UnitCommentVM } from 'app/main/models/analysis/UnitCommentVM';
import { UnitCommentService } from 'app/main/services/unit-comment.service';

@Component({
    selector     : 'unit-comment-details-form-dialog',
    templateUrl  : './unit-comment-details-form.component.html',
    styleUrls    : ['./unit-comment-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UnitCommentDetailsFormDialogComponent
{
    action: string;
    unitCommentData: UnitCommentVM;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<UnitCommentDetailsFormDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(public matDialogRef: MatDialogRef<UnitCommentDetailsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _unitCommentService: UnitCommentService)
    {
        // Set the defaults
        this.action = _data.action;
        this.unitCommentData = _data.unitComment;
        this.dialogTitle = 'Yorum Detayı';
    }

    trash()
    {
        let status = new CommentStatusUpdateRequestVM();
        status.id = this.unitCommentData.id;
        status.statusId = GlobalConstants.CommentStausType.Trash;

        this._unitCommentService.updateStatus(status)
            .subscribe(result=>{
                if(result.status == 200)
                {
                    this.matDialogRef.close(true);
                }
            });
    }

    confirm()
    {
        let status = new CommentStatusUpdateRequestVM();
        status.id = this.unitCommentData.id;
        status.statusId = GlobalConstants.CommentStausType.Approved;

        this._unitCommentService.updateStatus(status)
            .subscribe(result=>{
                if(result.status == 200)
                {
                    this.matDialogRef.close(true);
                }
            });
    }
}