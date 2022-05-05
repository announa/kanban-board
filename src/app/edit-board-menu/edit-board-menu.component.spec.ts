import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoardMenuComponent } from './edit-board-menu.component';

describe('EditMenuComponent', () => {
  let component: EditBoardMenuComponent;
  let fixture: ComponentFixture<EditBoardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBoardMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBoardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
