import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamefieldComponent } from './components/gamefield/gamefield.component';
import { DescriptionCanvasComponent } from './components/description-canvas/description-canvas.component';
import { ResultsComponent } from './components/results/results.component';
import { StartComponent } from './components/start/start.component';
import { RoundDrawingComponent } from './components/round-drawing/round-drawing.component';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';

const routes: Routes = [
    {
        path: '',
        component: GamefieldComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: StartComponent,
            },
            {
                path: 'describe',
                component: DescriptionCanvasComponent,
            },
            {
                path: 'draw',
                component: RoundDrawingComponent,
            },
            {
                path: 'loading',
                component: LoadingSpinnerComponent,
            },
        ],
    },
    {
        path: 'results',
        component: ResultsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GameRoutingModule {}
