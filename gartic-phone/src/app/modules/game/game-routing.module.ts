import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamefieldComponent } from './components/gamefield/gamefield.component';
import { DescriptionCanvasComponent } from './components/description-canvas/description-canvas.component';
import { ResultsComponent } from './components/results/results.component';
import { DrawingEditorComponent } from '../drawing-editor/components/drawing-editor/drawing-editor.component';

const routes: Routes = [
    {
        path: '',
        component: GamefieldComponent,
        children: [
            {
                path: '',
                component: DescriptionCanvasComponent,
            },
            {
                path: 'draw',
                component: DrawingEditorComponent,
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
