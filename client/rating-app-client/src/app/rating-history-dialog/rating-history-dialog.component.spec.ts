import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingHistoryDialogComponent } from './rating-history-dialog.component';

describe('RatingHistoryDialogComponent', () => {
  let component: RatingHistoryDialogComponent;
  let fixture: ComponentFixture<RatingHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
