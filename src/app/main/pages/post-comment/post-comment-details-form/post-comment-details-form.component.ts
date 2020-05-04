import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostCommentVM } from 'app/main/models/blog/PostCommentVM';
import { PostCommentService } from 'app/main/services/post-comment.service';
import { CommentStatusUpdateRequestVM } from 'app/main/models/blog/CommentStatusUpdateRequestVM';

@Component({
    selector     : 'post-comment-details-form-dialog',
    templateUrl  : './post-comment-details-form.component.html',
    styleUrls    : ['./post-comment-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PostCommentDetailsFormDialogComponent
{
    action: string;
    postCommentData: PostCommentVM;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PostCommentDetailsFormDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(public matDialogRef: MatDialogRef<PostCommentDetailsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _postCommentService: PostCommentService)
    {
        // Set the defaults
        this.action = _data.action;
        this.postCommentData = _data.postComment;
        this.dialogTitle = 'Yorum Detayı';
    }

    trash()
    {
        let status = new CommentStatusUpdateRequestVM();
        status.id = this.postCommentData.id;
        status.statusId = GlobalConstants.CommentStausType.Trash;

        this._postCommentService.updateStatus(status)
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
        status.id = this.postCommentData.id;
        status.statusId = GlobalConstants.CommentStausType.Approved;

        this._postCommentService.updateStatus(status)
            .subscribe(result=>{
                if(result.status == 200)
                {
                    this.matDialogRef.close(true);
                }
            });
    }
}