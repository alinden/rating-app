import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsDistributionComponent } from './ratings-distribution.component';

describe('RatingsDistributionComponent', () => {
  let component: RatingsDistributionComponent;
  let fixture: ComponentFixture<RatingsDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
