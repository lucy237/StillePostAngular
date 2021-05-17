import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormJoinLobbyComponent } from './form-join-lobby.component';

describe('FormJoinLobbyComponent', () => {
  let component: FormJoinLobbyComponent;
  let fixture: ComponentFixture<FormJoinLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormJoinLobbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormJoinLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
