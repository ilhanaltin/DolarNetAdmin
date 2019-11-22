import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { PostService } from 'app/main/services/post.service';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from '../../services/posts.service';
import { PostComponent } from './post/post.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AuthGuard } from 'app/main/services/auth-guard.service';

const routes: Routes = [
    {
        path     : 'posts',
        component: PostsComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: PostsService
        }
    },
    {
        path     : 'posts/:id',
        component: PostComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: PostService
        }
    }
];

@NgModule({
    declarations: [
        PostsComponent,
        PostComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        
        CKEditorModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        PostsService,
        PostService,

        AuthGuard
    ]
})
export class BlogModule
{
}
