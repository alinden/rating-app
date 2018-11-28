import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedGameCardItemComponent } from './rated-game-card-item.component';

describe('RatedGameCardItemComponent', () => {
  let component: RatedGameCardItemComponent;
  let fixture: ComponentFixture<RatedGameCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatedGameCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatedGameCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
