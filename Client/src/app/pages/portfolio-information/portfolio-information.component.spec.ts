import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioInformationComponent } from './portfolio-information.component';

describe('PortfolioInformationComponent', () => {
  let component: PortfolioInformationComponent;
  let fixture: ComponentFixture<PortfolioInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioInformationComponent]
    });
    fixture = TestBed.createComponent(PortfolioInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
