import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTitleComponent } from './add-title.component';

describe('AddTitleComponent', () => {
  let component: AddTitleComponent;
  let fixture: ComponentFixture<AddTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
