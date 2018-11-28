import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedUserCardItemComponent } from './rated-user-card-item.component';

describe('RatedUserCardItemComponent', () => {
  let component: RatedUserCardItemComponent;
  let fixture: ComponentFixture<RatedUserCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatedUserCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatedUserCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
