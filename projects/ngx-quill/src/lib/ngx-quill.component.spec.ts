import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxQuillComponent } from './ngx-quill.component';

describe('NgxQuillComponent', () => {
  let component: NgxQuillComponent;
  let fixture: ComponentFixture<NgxQuillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxQuillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
