import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatachartComponent } from './datachart.component';

describe('DatachartComponent', () => {
  let component: DatachartComponent;
  let fixture: ComponentFixture<DatachartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatachartComponent]
    });
    fixture = TestBed.createComponent(DatachartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
