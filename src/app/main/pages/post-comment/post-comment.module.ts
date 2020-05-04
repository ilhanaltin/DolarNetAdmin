import { AuthGuardAdmin } from '../../services/auth-guard-admin.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AuthGuard } from '../../services/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MatPaginatorModule } from '@angular/material/paginator';
import { PostCommentService } from 'app/main/services/post-comment.service';
import { PostCommentComponent } from './post-comment.component';
import { PostCommentListComponent } from './post-comment-list/post-comment-list.component';
import { PostCommentsMainSidebarComponent } from './sidebars/main/main.component';
import { PostCommentDetailsFormDialogComponent } from './post-comment-details-form/post-comment-details-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
    {
        path     : 'post-comment',
        component: PostCommentComponent,
        canActivate: [AuthGuard, AuthGuardAdmin],
        resolve  : { audit: PostCommentService }
    }
];

@NgModule({
    declarations   : [
        PostCommentComponent,
        PostCommentListComponent,
        PostCommentsMainSidebarComponent,
        PostCommentDetailsFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatSelectModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        PostCommentService,

        AuthGuard,
        AuthGuardAdmin
    ],
    entryComponents: [
        PostCommentDetailsFormDialogComponent
    ]
})
export class PostCommentModule
{
}
