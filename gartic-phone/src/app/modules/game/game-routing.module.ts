import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamefieldComponent } from './components/gamefield/gamefield.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { DescriptionCanvasComponent } from './components/description-canvas/description-canvas.component';
import { ResultsComponent } from './components/results/results.component';
import { TimerComponent } from './components/timer/timer.component';

const routes: Routes = [
    {
        path: 'game',
        component: GamefieldComponent,
    },

    {
        path: 'description',
        component: DescriptionCanvasComponent,
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
