import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    // TODO: snackbar service improven & verwenden :)
    private snackbarSubject = new Subject<any>();
    public snackbarState$ = this.snackbarSubject.asObservable();

    constructor() {}

    activateSnackbar(snackbarText: string): void {
        this.snackbarSubject.next({
            showSnackbar: true,
            snackbarText,
        });
    }

    hideSnackbar(): void {}
}
