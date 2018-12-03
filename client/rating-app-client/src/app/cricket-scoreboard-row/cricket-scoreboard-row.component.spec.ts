import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CricketScoreboardRowComponent } from './cricket-scoreboard-row.component';

describe('CricketScoreboardRowComponent', () => {
  let component: CricketScoreboardRowComponent;
  let fixture: ComponentFixture<CricketScoreboardRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CricketScoreboardRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CricketScoreboardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
