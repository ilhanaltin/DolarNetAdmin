import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AuthGuard } from './../../services/auth-guard.service';
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

import { AuditComponent } from 'app/main/pages/audit/audit.component';
import { LogsLogListComponent } from 'app/main/pages/audit/log-list/log-list.component';
import { LogsMainSidebarComponent } from 'app/main/pages/audit/sidebars/main/main.component';
import { AuditService } from 'app/main/services/audit.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuditDetailsFormDialogComponent } from './audit-details-form/audit-details-form.component';

const routes: Routes = [
    {
        path     : 'audit',
        component: AuditComponent,
        canActivate: [AuthGuard],
        resolve  : { audit: AuditService }
    }
];

@NgModule({
    declarations   : [
        AuditComponent,
        LogsLogListComponent,
        LogsMainSidebarComponent,
        AuditDetailsFormDialogComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        AuditService
    ],
    entryComponents: [
        AuditDetailsFormDialogComponent
    ]
})
export class AuditModule
{
}
