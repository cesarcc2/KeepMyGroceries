import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageTypeFilterSelectorPage } from './storage-type-filter-selector.page';

describe('StorageTypeFilterSelectorPage', () => {
  let component: StorageTypeFilterSelectorPage;
  let fixture: ComponentFixture<StorageTypeFilterSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageTypeFilterSelectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageTypeFilterSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
