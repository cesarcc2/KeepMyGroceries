import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostHelpPage } from './create-post-help.page';

describe('CreatePostHelpPage', () => {
  let component: CreatePostHelpPage;
  let fixture: ComponentFixture<CreatePostHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePostHelpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
