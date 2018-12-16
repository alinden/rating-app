import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinLossRecordComponent } from './win-loss-record.component';

describe('WinLossRecordComponent', () => {
  let component: WinLossRecordComponent;
  let fixture: ComponentFixture<WinLossRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinLossRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinLossRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
