import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFirebase } from './ngx-firebase';

describe('NgxFirebase', () => {
  let component: NgxFirebase;
  let fixture: ComponentFixture<NgxFirebase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFirebase],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxFirebase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
