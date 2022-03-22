import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsPreviewComponent } from './boards-preview.component';

describe('BoardsPreviewComponent', () => {
  let component: BoardsPreviewComponent;
  let fixture: ComponentFixture<BoardsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
