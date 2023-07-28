import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStandardComponent } from './detail-standard.component';

describe('DetailStandardComponent', () => {
  let component: DetailStandardComponent;
  let fixture: ComponentFixture<DetailStandardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailStandardComponent]
    });
    fixture = TestBed.createComponent(DetailStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
