import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepScoreComponent } from './keep-score.component';

describe('KeepScoreComponent', () => {
  let component: KeepScoreComponent;
  let fixture: ComponentFixture<KeepScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeepScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
