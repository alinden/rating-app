import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCardItemComponent } from './users-card-item.component';

describe('UsersCardItemComponent', () => {
  let component: UsersCardItemComponent;
  let fixture: ComponentFixture<UsersCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
