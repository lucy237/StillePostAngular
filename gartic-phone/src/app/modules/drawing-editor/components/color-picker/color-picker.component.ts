import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Color } from '../../utils/CanvasUtils';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() colors: Array<Color> = [];
  @Output() colorEvent = new EventEmitter<Color>();
  activeColor: Color = { value: '#2a3', key: 'green' };

  setColor(color: Color): void {
    this.activeColor = color;
    this.colorEvent.emit(color);
  }
}
