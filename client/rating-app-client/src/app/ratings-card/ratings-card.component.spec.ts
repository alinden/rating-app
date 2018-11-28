import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsCardComponent } from './ratings-card.component';

describe('RatingsCardComponent', () => {
  let component: RatingsCardComponent;
  let fixture: ComponentFixture<RatingsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
