import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthTotalComponent } from './month-total.component';

describe('MonthTotalComponent', () => {
  let component: MonthTotalComponent;
  let fixture: ComponentFixture<MonthTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
