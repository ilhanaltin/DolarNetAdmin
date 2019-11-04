import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddUpdateDialogComponent } from './user-add-update-dialog.component';

describe('UserAddUpdateComponent', () => {
  let component: UserAddUpdateDialogComponent;
  let fixture: ComponentFixture<UserAddUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
