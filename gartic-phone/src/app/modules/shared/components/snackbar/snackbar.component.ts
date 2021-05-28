import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit, OnDestroy {
    showSnackbar = false;
    snackbarText = 'Something went wrong';
    private snackbarSubscription: Subscription;

    constructor(private snackbarService: SnackbarService) {}

    ngOnInit(): void {
        this.snackbarSubscription = this.snackbarService.snackbarState$.subscribe((state) => {
            this.snackbarText = state.snackbarText;
            this.showSnackbar = state.showSnackbar;
            setTimeout(() => {
                this.showSnackbar = false;
            }, 3000);
        });
    }

    ngOnDestroy(): void {
        this.snackbarSubscription.unsubscribe();
    }
}
