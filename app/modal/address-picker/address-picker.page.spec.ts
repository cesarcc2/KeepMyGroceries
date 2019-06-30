import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPickerPage } from './address-picker.page';

describe('AddressPickerPage', () => {
  let component: AddressPickerPage;
  let fixture: ComponentFixture<AddressPickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressPickerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
