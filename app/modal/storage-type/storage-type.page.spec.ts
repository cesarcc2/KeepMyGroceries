import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageTypePage } from './storage-type.page';

describe('StorageTypePage', () => {
  let component: StorageTypePage;
  let fixture: ComponentFixture<StorageTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
