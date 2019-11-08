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

import { UsersComponent } from 'app/main/pages/users/users.component';
import { UsersUserListComponent } from 'app/main/pages/users/user-list/user-list.component';
import { UsersSelectedBarComponent } from 'app/main/pages/users/selected-bar/selected-bar.component';
import { UsersMainSidebarComponent } from 'app/main/pages/users/sidebars/main/main.component';
import { UsersUserFormDialogComponent } from 'app/main/pages/users/user-form/user-form.component';
import { UsersService } from 'app/main/services/users.service';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [
    {
        path     : 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        resolve  : { users: UsersService }
    }
];

@NgModule({
    declarations   : [
        UsersComponent,
        UsersUserListComponent,
        UsersSelectedBarComponent,
        UsersMainSidebarComponent,
        UsersUserFormDialogComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        UsersService
    ],
    entryComponents: [
        UsersUserFormDialogComponent
    ]
})
export class UsersModule
{
}
