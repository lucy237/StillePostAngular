import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    // TODO: snackbar service improven & verwenden :)
    showSnackbar = false;
    snackbarText = 'Something went wrong';

    constructor() {}

    activateSnackbar(text: string): void {
        this.snackbarText = text;
        this.showSnackbar = true;
    }

    hideSnackbar(): void {
        this.showSnackbar = false;
    }
}
