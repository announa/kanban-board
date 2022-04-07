import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBgComponent } from './set-bg.component';

describe('SetBgComponent', () => {
  let component: SetBgComponent;
  let fixture: ComponentFixture<SetBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetBgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
