import { UserListResponseDetailsVM } from './../../models/user/UserListResponseDetailsVM';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'app/main/services/user.service';
import { UserVM } from 'app/main/models/user/UserVM';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserAddUpdateDialogComponent } from '../user-add-update-dialog/user-add-update-dialog.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations   : fuseAnimations
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'name', 'surname', 'roleName','email','userStatusTypeName'];
  dataSource: MatTableDataSource<UserVM>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private userService: UserService, public dialog: MatDialog) { 
     // Assign the data to the data source for the table to render
     var usersVM: UserVM[] = []
     this.dataSource = new MatTableDataSource(usersVM);
  }

  ngOnInit() {
    this.getUsers().subscribe(resp => {
      var userList = resp.result.userList as UserVM[]; 
      this.dataSource = new MatTableDataSource(userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log(resp.result.userList);
    });
  }  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers()
  {
    return this.userService.getAll();
  }

  openDialog(): void {

    let userVM = new UserVM({});

    const dialogRef = this.dialog.open(UserAddUpdateDialogComponent, {
      width: '250px', data: userVM
      //data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}