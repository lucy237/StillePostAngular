import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CreateLobby } from '../../../../store/lobby.actions';

@Component({
    selector: 'app-description-canvas',
    templateUrl: './description-canvas.component.html',
    styleUrls: ['./description-canvas.component.scss'],
})
export class DescriptionCanvasComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
    onSubmit(): void {}
}
