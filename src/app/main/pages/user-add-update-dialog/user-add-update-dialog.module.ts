import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatTableModule } from '@angular/material/table';
import { UserAddUpdateDialogComponent } from './user-add-update-dialog.component';


@NgModule({
    declarations: [
        UserAddUpdateDialogComponent
    ],
    imports: [
        TranslateModule,
        MatTableModule,
        FuseSharedModule,
        MatDialogModule
    ],
    exports: [
        UserAddUpdateDialogComponent
    ]
})

export class UserAddUpdateDialogModule {
}
