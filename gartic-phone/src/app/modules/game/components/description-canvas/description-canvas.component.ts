import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-description-canvas',
    templateUrl: './description-canvas.component.html',
    styleUrls: ['./description-canvas.component.scss'],
})
export class DescriptionCanvasComponent implements OnInit {
    @Output() descriptionChanged = new EventEmitter<string>();
    constructor() {}

    ngOnInit(): void {}
}
