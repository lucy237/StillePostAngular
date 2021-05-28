import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LobbyState } from '../../../../store/lobby.state';
import { Observable } from 'rxjs';
import { PlayersState } from '../../../../store/players.state.';
import { Lobby, Player, Round } from '../../../shared/types/types';
import { DbService } from '../../../shared/services/db.service';
import { AuthState } from '../../../../store/auth.state';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
    @Select(AuthState.userId) playerId$: Observable<string>;
    @Select(LobbyState.lobbyId) lobbyId$: Observable<string>;
    @Select(LobbyState.lobby) lobby$: Observable<Lobby>;
    @Select(PlayersState.host) host$: Observable<Player>;

    isLoading = false;
    lobby: Lobby = null;
    players = [];
    currentPlayerIndex = 0;
    currentAlbum: Round[] = null;

    constructor(private store: Store, private dbService: DbService) {}

    async ngOnInit(): Promise<void> {
        this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);
        this.players = this.store.selectSnapshot<Player[]>(PlayersState.players);
        await this.getNewAlbum();
    }

    async getNewAlbum(): Promise<void> {
        this.isLoading = true;
        this.currentAlbum = await this.dbService.getAllRoundsFromPlayer(
            this.store.selectSnapshot<string>(LobbyState.lobbyId),
            this.lobby.playerOrder[this.currentPlayerIndex]
        );
        this.isLoading = false;
    }

    getPlayerById(playerId): Player {
        return this.players.find((player) => player.id === playerId);
    }

    async onPreviousClick(): Promise<void> {
        const previous = this.currentPlayerIndex - 1;
        this.currentPlayerIndex = previous < 0 ? this.players.length - 1 : previous;
        await this.getNewAlbum();
    }

    async onNextClick(): Promise<void> {
        const next = this.currentPlayerIndex + 1;
        this.currentPlayerIndex = next === this.players.length ? 0 : next;
        await this.getNewAlbum();
    }
}
