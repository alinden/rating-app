import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesCardItemComponent } from './leagues-card-item.component';

describe('LeaguesCardItemComponent', () => {
  let component: LeaguesCardItemComponent;
  let fixture: ComponentFixture<LeaguesCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguesCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
