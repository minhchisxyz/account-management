import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationYearComponent } from './navigation-year.component';

describe('NavigationYearComponent', () => {
  let component: NavigationYearComponent;
  let fixture: ComponentFixture<NavigationYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigationYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
