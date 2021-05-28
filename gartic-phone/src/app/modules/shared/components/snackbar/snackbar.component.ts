import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
    showSnackbar = false;

    constructor() {}

    ngOnInit(): void {}

    activateSnackbar(errorText: string): void {}
    deactivateSnackbar(errorText: string): void {}
}
