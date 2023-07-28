import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInformationComponent } from './add-information.component';

describe('AddInformationComponent', () => {
  let component: AddInformationComponent;
  let fixture: ComponentFixture<AddInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInformationComponent]
    });
    fixture = TestBed.createComponent(AddInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
