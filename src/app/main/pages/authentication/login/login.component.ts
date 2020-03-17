import { GlobalConstants } from 'app/main/models/Constants/GlobalConstants';
import { AppComponent } from 'app/app.component';
import { AuthenticationService } from './../../../services/authentication.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { ServiceResult } from 'app/main/models/ServiceResult';
import { LoginResponseDetailsVM } from 'app/main/models/authentication/LoginResponseDetailsVM';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    invalidLogin: boolean;

    _result: ServiceResult<LoginResponseDetailsVM>;
 
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {AuthenticationService} _authenticationService,
     * @param {Router} _router,
     * @param {AppComponent} _appComponent
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private _appComponent: AppComponent
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            fromAdmin: [true]
        });
    }

    login(credentials) : void {
        this._authenticationService.login(credentials)
            .subscribe(result =>{

                this._result = result;
                if(result.status == 200)
                {
                    let role = Number(localStorage.getItem("current-user-role"));
                    this._appComponent.changeNavigation(role);

                    if(role == GlobalConstants.UserRoles.Admin)
                    {
                        this._router.navigate(['/users']);
                    }
                    else
                    {
                        this._router.navigate(['/posts']);
                    }
                }
                else
                {
                    this.invalidLogin = true;
                }
        });
    }
}
