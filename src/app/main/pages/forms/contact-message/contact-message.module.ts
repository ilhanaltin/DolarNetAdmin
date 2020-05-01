import { ContactMessageDetailsFormDialogComponent } from './contact-message-details-form/contact-message-details-form.component';
import { ContactMessageComponent } from './contact-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
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
import { ContactMessageListComponent } from './contact-message-list/contact-message-list.component';
import { AuthGuard } from 'app/main/services/auth-guard.service';
import { AuthGuardAdmin } from 'app/main/services/auth-guard-admin.service';
import { ContactMessageService } from 'app/main/services/contact-message.service';

const routes: Routes = [
    {
        path     : 'contact-messages',
        component: ContactMessageComponent,
        canActivate: [AuthGuard, AuthGuardAdmin],
        resolve  : { audit: ContactMessageService }
    }
];

@NgModule({
    declarations   : [
        ContactMessageComponent,
        ContactMessageListComponent,
        ContactMessageDetailsFormDialogComponent
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
        ContactMessageService,

        AuthGuard,
        AuthGuardAdmin
    ],
    entryComponents: [
        ContactMessageDetailsFormDialogComponent
    ]
})
export class ContactMessageModule
{
}
