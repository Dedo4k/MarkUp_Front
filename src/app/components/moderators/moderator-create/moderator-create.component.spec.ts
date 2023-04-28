import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorCreateComponent } from './moderator-create.component';

describe('ModeratorCreateComponent', () => {
  let component: ModeratorCreateComponent;
  let fixture: ComponentFixture<ModeratorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeratorCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
