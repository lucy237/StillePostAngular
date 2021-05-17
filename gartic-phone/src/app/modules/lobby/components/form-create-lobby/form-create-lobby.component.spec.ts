import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateLobbyComponent } from './form-create-lobby.component';

describe('FormCreateLobbyComponent', () => {
  let component: FormCreateLobbyComponent;
  let fixture: ComponentFixture<FormCreateLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreateLobbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
