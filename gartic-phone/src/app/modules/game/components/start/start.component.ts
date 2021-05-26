import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
    @Output() descriptionChanged = new EventEmitter<string>();
    constructor() {}
    ngOnInit(): void {}
}
