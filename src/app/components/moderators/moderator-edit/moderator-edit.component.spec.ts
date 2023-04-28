import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorEditComponent } from './moderator-edit.component';

describe('ModeratorEditComponent', () => {
  let component: ModeratorEditComponent;
  let fixture: ComponentFixture<ModeratorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeratorEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
