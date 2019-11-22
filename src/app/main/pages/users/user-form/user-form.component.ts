import { RegisterUserVM } from './../../../models/user/RegisterUserVM';
import { EditUserVM } from './../../../models/user/EditUserVM';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector     : 'users-user-form-dialog',
    templateUrl  : './user-form.component.html',
    styleUrls    : ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsersUserFormDialogComponent
{
    action: string;
    editUser: EditUserVM;
    registerUser: RegisterUserVM;
    userForm: FormGroup;
    roles = [];
    statusList = [];
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<UsersUserFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<UsersUserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Kullanıcı Güncelle';
            this.editUser = _data.user;
        }
        else
        {
            this.dialogTitle = 'Yeni Kullancı';
            this.registerUser = new RegisterUserVM({});
        }

        this.userForm = this.createUserForm();

        this.roles = this.getRoles();
        this.statusList = this.getStatusList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup
    {
        if ( this.action === 'edit' )
        {
            return this._formBuilder.group({
                id          : [this.editUser.id],
                name        : [this.editUser.name, Validators.required],
                lastName    : [this.editUser.lastName, Validators.required],
                nickName    : [this.editUser.nickName, Validators.required],
                avatar      : [this.editUser.avatar],
                email       : [this.editUser.email, [Validators.required, Validators.email]],
                statusId    : [this.editUser.statusId, Validators.required],
                roleId      : [this.editUser.roleId, Validators.required]
            });        
        }
        else
        {
            return this._formBuilder.group({
                name        : ['', Validators.required],
                lastName    : ['', Validators.required],
                nickName    : ['', Validators.required],
                avatar          : null,
                email           : ['', [Validators.required, Validators.email]],
                password        : ['', Validators.required],
                passwordConfirm : ['', [Validators.required, confirmPasswordValidator]],
                roleId          : ['', Validators.required],
                statusId        : [1]
            });        
        }        
    }

    onFileChanged(event) {

        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.userForm.get('avatar').setValue(reader.result as string);
                
                if ( this.action === 'edit' )
                {
                    this.editUser.avatar = reader.result;
                }
                else
                {
                    this.registerUser.avatar = reader.result;
                }
            };
        }
      }

    getRoles() {
        return [
          { id: 1, name: 'Yönetici' },
          { id: 2, name: 'Editör' },
          { id: 3, name: 'Üye' }
        ];
      }

    getStatusList() {
        return [
          { id: 1, name: 'Aktif' },
          { id: 2, name: 'Silinmiş' },
          { id: 3, name: 'Kara Listede' }
        ];
      }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};