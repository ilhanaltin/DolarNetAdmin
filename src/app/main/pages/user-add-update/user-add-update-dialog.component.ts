import { Inject, Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserVM } from 'app/main/models/user/UserVM';

@Component({
  selector: 'user-add-update-dialog',
  templateUrl: './user-add-update-dialog.component.html',
  styleUrls: ['./user-add-update-dialog.component.scss']
})
export class UserAddUpdateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserAddUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserVM) {}

  ngOnInit() {
  }

}
