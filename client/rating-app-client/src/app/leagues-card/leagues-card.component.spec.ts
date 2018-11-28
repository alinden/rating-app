import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesCardComponent } from './leagues-card.component';

describe('LeaguesCardComponent', () => {
  let component: LeaguesCardComponent;
  let fixture: ComponentFixture<LeaguesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
