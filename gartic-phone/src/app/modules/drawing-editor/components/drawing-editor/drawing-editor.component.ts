import { Component, EventEmitter, Output } from '@angular/core';
import { Color } from '../../utils/CanvasUtils';

@Component({
    selector: 'app-drawing-editor',
    templateUrl: './drawing-editor.component.html',
    styleUrls: ['./drawing-editor.component.scss'],
})
export class DrawingEditorComponent {
    colors: Array<Color> = [
        { value: '#2a3', key: 'green' },
        { value: '#34b7b7', key: 'cyan' },
        { value: '#24b', key: 'blue' },
        { value: '#e32', key: 'red' },
        { value: '#fe2', key: 'yellow' },
        { value: '#000', key: 'black' },
        { value: '#aaa', key: 'gray' },
    ];
    color = this.colors[0];
    base64 = '';
    imgWidth = 0;
    imgHeight = 0;

    @Output() drawingChanged = new EventEmitter<{ base64: string; width: number; height: number }>();

    setColor(color: Color): void {
        this.color = color;
    }

    saveImage(base64: string, width: number, height: number): void {
        this.drawingChanged.emit({
            base64,
            width,
            height,
        });
    }
}
