import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Color } from '../../../drawing-editor/utils/CanvasUtils';
import { GameService } from '../../services/game.service';
import { DbService } from '../../../shared/services/db.service';
import { Lobby } from '../../../shared/types/types';
import { LobbyState } from '../../../../store/lobby.state';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../store/auth.state';

@Component({
    selector: 'app-round-drawing',
    templateUrl: './round-drawing.component.html',
    styleUrls: ['./round-drawing.component.scss'],
})
export class RoundDrawingComponent implements OnInit {
    colors: Array<Color> = [
        { value: '#2a3', key: 'green' },
        { value: '#34b7b7', key: 'cyan' },
        { value: '#24b', key: 'blue' },
        { value: '#e32', key: 'red' },
        { value: '#fe2', key: 'yellow' },
        { value: '#000', key: 'black' },
        { value: '#aaa', key: 'gray' },
    ];
    color = this.colors[0];
    base64 = '';
    description = '';
    lobby: Lobby = null;
    playerId: string = null;
    lobbyId: string = null;

    @Output() drawingChanged = new EventEmitter<{ base64: string; width: number; height: number }>();

    constructor(private gameService: GameService, private dbService: DbService, private store: Store) {}

    ngOnInit(): void {
        this.playerId = this.store.selectSnapshot<string>(AuthState.userId);
        this.lobbyId = this.store.selectSnapshot<string>(LobbyState.lobbyId);
        this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);

        // Round Logic - calculate next round route
        const lastPlayerId = this.gameService.getLastPlayerId(this.playerId);
        this.dbService.getLastRoundFromPlayer(this.lobbyId, lastPlayerId).subscribe(async (round) => {
            if (round[0]?.value) {
                this.description = round[0]?.value;
            }
        });
    }

    setColor(color: Color): void {
        this.color = color;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    saveImage(base64: string, width: number, height: number): void {
        this.drawingChanged.emit({
            base64,
            width,
            height,
        });
    }
}
