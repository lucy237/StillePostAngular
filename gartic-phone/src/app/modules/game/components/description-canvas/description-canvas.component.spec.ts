import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionCanvasComponent } from './description-canvas.component';

describe('DescriptionCanvasComponent', () => {
  let component: DescriptionCanvasComponent;
  let fixture: ComponentFixture<DescriptionCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
