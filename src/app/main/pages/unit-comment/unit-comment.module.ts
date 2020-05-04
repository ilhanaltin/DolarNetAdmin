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
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnitCommentComponent } from './unit-comment.component';
import { UnitCommentService } from 'app/main/services/unit-comment.service';
import { UnitCommentListComponent } from './unit-comment-list/unit-comment-list.component';
import { UnitCommentsMainSidebarComponent } from './sidebars/main/main.component';
import { UnitCommentDetailsFormDialogComponent } from './unit-comment-details-form/unit-comment-details-form.component';

const routes: Routes = [
    {
        path     : 'unit-comment',
        component: UnitCommentComponent,
        canActivate: [AuthGuard, AuthGuardAdmin],
        resolve  : { audit: UnitCommentService }
    }
];

@NgModule({
    declarations   : [
        UnitCommentComponent,
        UnitCommentListComponent,
        UnitCommentsMainSidebarComponent,
        UnitCommentDetailsFormDialogComponent
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
        UnitCommentService,

        AuthGuard,
        AuthGuardAdmin
    ],
    entryComponents: [
        UnitCommentDetailsFormDialogComponent
    ]
})
export class UnitCommentModule
{
}
