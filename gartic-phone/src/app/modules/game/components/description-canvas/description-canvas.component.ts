import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-description-canvas',
    templateUrl: './description-canvas.component.html',
    styleUrls: ['./description-canvas.component.scss'],
})
export class DescriptionCanvasComponent implements OnInit {
    drawing = '';
    @Output() descriptionChanged = new EventEmitter<string>();

    ngOnInit(): void {}

    setDrawing(drawing: string): void {
        this.drawing = drawing;
    }
}
