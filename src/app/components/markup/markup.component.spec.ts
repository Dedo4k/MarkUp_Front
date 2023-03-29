import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkupComponent } from './markup.component';

describe('MarkupComponent', () => {
  let component: MarkupComponent;
  let fixture: ComponentFixture<MarkupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
