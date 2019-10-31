import { UserListResponseDetailsVM } from './../../models/user/UserListResponseDetailsVM';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'app/main/services/user.service';
import { UserVM } from 'app/main/models/user/UserVM';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'name', 'surname', 'roleName','email','userStatusTypeName'];
  dataSource: MatTableDataSource<UserVM>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private userService: UserService) { 
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
}