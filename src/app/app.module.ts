import { PostCommentModule } from './main/pages/post-comment/post-comment.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { UsersModule } from './main/pages/users/users.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from 'app/fake-db/fake-db.service';
import { LoginModule } from './main/pages/authentication/login/login.module';
import { AuditModule } from './main/pages/audit/audit.module';
import { BlogModule } from './main/pages/blog/blog.module';
import { FileManagerModule } from './main/pages/file-manager/file-manager.module';
import { ContactMessageModule } from './main/pages/forms/contact-message/contact-message.module';
import { UnitCommentModule } from './main/pages/unit-comment/unit-comment.module';

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'users'
    }
];

@NgModule({
    declarations: [
        AppComponent        
        ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        LoginModule,
        UsersModule,
        AuditModule,
        ContactMessageModule,
        BlogModule,
        FileManagerModule,
        PostCommentModule,
        UnitCommentModule
    ],
    bootstrap   : [
        AppComponent        
    ]
})
export class AppModule
{
}
