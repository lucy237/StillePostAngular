import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-form-description',
    templateUrl: './form-description.component.html',
    styleUrls: ['./form-description.component.scss'],
})
export class FormDescriptionComponent implements OnInit {
    description = '';
    @Output() descriptionChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    onSubmit(): void {}

    onChange(): void {
        this.descriptionChanged.emit(this.description);
    }
}
