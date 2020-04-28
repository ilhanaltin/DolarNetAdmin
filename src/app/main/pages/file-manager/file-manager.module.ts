import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { FileManagerComponent } from './file-manager.component';
import { AuthGuard } from 'app/main/services/auth-guard.service';
import { FileManagerFileListComponent } from './file-list/file-list.component';
import { FileManagerMainSidebarComponent } from './sidebars/main/main.component';
import { FileManagerDetailsSidebarComponent } from './sidebars/details/details.component';
import { FileManagerService } from 'app/main/services/file-manager.service';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [
    {
        path     : 'file-manager',
        component: FileManagerComponent,
        canActivate: [AuthGuard],
        resolve  : {
            files: FileManagerService
        }
    }
];

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerFileListComponent,
        FileManagerMainSidebarComponent,
        FileManagerDetailsSidebarComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatTableModule,
        
        MatPaginatorModule,
        FuseSharedModule,
        FuseSidebarModule
    ],
    providers   : [
        FileManagerService
    ]
})
export class FileManagerModule
{
}
