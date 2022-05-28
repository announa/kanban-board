import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReauthenticateComponent } from './reauthenticate.component';

describe('ReauthenticateComponent', () => {
  let component: ReauthenticateComponent;
  let fixture: ComponentFixture<ReauthenticateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReauthenticateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReauthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
