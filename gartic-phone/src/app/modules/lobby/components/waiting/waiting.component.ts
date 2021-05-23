import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Lobby, Player } from '../../../shared/types/types';
import { LobbyState } from '../../../../store/lobby.state';
import { PlayersState } from '../../../../store/players.state.';
import { Router } from '@angular/router';
import { AuthState } from '../../../../store/auth.state';
import { UpdateLobby } from '../../../../store/lobby.actions';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit {
    @Select(AuthState.userId) playerId$: Observable<string>;
    @Select(LobbyState.lobbyId) lobbyId$: Observable<string>;
    @Select(LobbyState.lobby) lobby$: Observable<Lobby>;
    @Select(PlayersState.players) players$: Observable<Player[]>;
    @Select(PlayersState.host) host$: Observable<Player>;

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {
        this.lobby$.subscribe(async (lobby) => {
            if (lobby.isActive) {
                const id = this.store.selectSnapshot<string>(LobbyState.lobbyId);
                await this.router.navigate([`${id}/game`]);
            }
        });
    }

    startGame(): void {
        this.store.dispatch(new UpdateLobby({ isActive: true }));
    }
}
