import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthState } from '../../../../store/auth.state';
import { LobbyState } from '../../../../store/lobby.state';
import { Lobby } from '../../../shared/types/types';
import { GameService } from '../../services/game.service';
import { DbService } from '../../../shared/services/db.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-description-canvas',
    templateUrl: './description-canvas.component.html',
    styleUrls: ['./description-canvas.component.scss'],
})
export class DescriptionCanvasComponent implements OnInit {
    @Select(LobbyState.roundId) roundId$: Observable<number>;
    drawing = '';
    lobby: Lobby = null;
    playerId: string = null;
    lobbyId: string = null;
    @Output() descriptionChanged = new EventEmitter<string>();

    constructor(private gameService: GameService, private dbService: DbService, private store: Store) {}

    ngOnInit(): void {
        this.playerId = this.store.selectSnapshot<string>(AuthState.userId);
        this.lobbyId = this.store.selectSnapshot<string>(LobbyState.lobbyId);
        this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);

        const lastPlayerId = this.gameService.getLastPlayerId(this.playerId);
        this.dbService.getLastRoundFromPlayer(this.lobbyId, lastPlayerId).subscribe((round) => {
            if (this.lobby.roundId + 1 < this.lobby.playerOrder.length) {
                if (round[0]?.value) {
                    this.drawing = round[0]?.value;
                }
            }
        });
    }
}
