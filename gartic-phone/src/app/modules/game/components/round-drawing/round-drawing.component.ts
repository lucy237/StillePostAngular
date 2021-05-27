import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Color } from '../../../drawing-editor/utils/CanvasUtils';

@Component({
    selector: 'app-round-drawing',
    templateUrl: './round-drawing.component.html',
    styleUrls: ['./round-drawing.component.scss'],
})
export class RoundDrawingComponent implements OnInit {
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
    description = '';

    @Output() drawingChanged = new EventEmitter<{ base64: string; width: number; height: number }>();

    constructor() {}

    ngOnInit(): void {}

    setColor(color: Color): void {
        this.color = color;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    saveImage(base64: string, width: number, height: number): void {
        this.drawingChanged.emit({
            base64,
            width,
            height,
        });
    }
}
