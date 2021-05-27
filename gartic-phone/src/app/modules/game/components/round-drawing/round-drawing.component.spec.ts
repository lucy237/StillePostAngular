import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDrawingComponent } from './round-drawing.component';

describe('RoundDrawingComponent', () => {
  let component: RoundDrawingComponent;
  let fixture: ComponentFixture<RoundDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
