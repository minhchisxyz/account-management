import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDetailsComponent } from './month-details.component';

describe('MonthDetailsComponent', () => {
  let component: MonthDetailsComponent;
  let fixture: ComponentFixture<MonthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
