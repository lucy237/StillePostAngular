import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerListComponent } from './components/player-list/player-list.component';
import { GamefieldComponent } from './components/gamefield/gamefield.component';
import { DescriptionCanvasComponent } from './components/description-canvas/description-canvas.component';
import { ResultsComponent } from './components/results/results.component';
import { FormsModule } from '@angular/forms';
import { GameRoutingModule } from './game-routing.module';
import { NgxsModule } from '@ngxs/store';
import { LobbyState } from '../../store/lobby.state';
import { TimerComponent } from './components/timer/timer.component';
import { DrawingEditorModule } from '../drawing-editor/drawing-editor.module';
import { StartComponent } from './components/start/start.component';

@NgModule({
    declarations: [
        PlayerListComponent,
        GamefieldComponent,
        DescriptionCanvasComponent,
        ResultsComponent,
        TimerComponent,
        StartComponent,
    ],
    imports: [CommonModule, DrawingEditorModule, FormsModule, GameRoutingModule, NgxsModule.forFeature([LobbyState])],
})
export class GameModule {}
