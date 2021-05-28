import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@NgModule({
    declarations: [LoadingSpinnerComponent, SnackbarComponent],
    imports: [CommonModule],
    exports: [LoadingSpinnerComponent, SnackbarComponent],
})
export class SharedModule {}
