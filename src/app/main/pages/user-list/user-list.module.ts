import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { UserListComponent } from './user-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes = [
    {
        path: 'user-list',
        component: UserListComponent
    }
];

@NgModule({
    declarations: [
        UserListComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,        
        FuseSharedModule,
        MatIconModule
        
    ],
    exports: [
        UserListComponent
    ]
})

export class UserListModule {
}
