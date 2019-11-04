import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserVM } from 'app/main/models/user/UserVM';

@Component({
    selector     : 'users-user-form-dialog',
    templateUrl  : './user-form.component.html',
    styleUrls    : ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsersUserFormDialogComponent
{
    action: string;
    user: UserVM;
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
            this.user = _data.user;
        }
        else
        {
            this.dialogTitle = 'Yeni Kullancı';
            this.user = new UserVM({});
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
        return this._formBuilder.group({
            id          : [this.user.id],
            name        : [this.user.name],
            lastName    : [this.user.lastName],
            nickname    : [this.user.nickname],
            avatar      : [this.user.avatar],
            email       : [this.user.email],
            statusId    : [this.user.statusId],
            roleId      : [this.user.roleId],
            roles       : [''],
            statusList  : ['']            
        });
    }

    getRoles() {
        return [
          { id: '1', name: 'Yönetici' },
          { id: '2', name: 'Editör' },
          { id: '3', name: 'Üye' }
        ];
      }

    getStatusList() {
        return [
          { id: '1', name: 'Aktif' },
          { id: '2', name: 'Silinmiş' },
          { id: '3', name: 'Kara Listede' }
        ];
      }
}