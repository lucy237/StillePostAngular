import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Lobby, Player } from '../../../shared/types/types';
import { LobbyState } from '../../../../store/lobby.state';
import { PlayersState } from '../../../../store/players.state.';
import { Router } from '@angular/router';
import { AuthState } from '../../../../store/auth.state';
import { SetPlayerOrder, UpdateLobby } from '../../../../store/lobby.actions';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit, OnDestroy {
    @Select(AuthState.userId) playerId$: Observable<string>;
    @Select(LobbyState.lobbyId) lobbyId$: Observable<string>;
    @Select(LobbyState.lobby) lobby$: Observable<Lobby>;
    @Select(PlayersState.players) players$: Observable<Player[]>;
    @Select(PlayersState.host) host$: Observable<Player>;
    lobbySubscription: Subscription = null;

    constructor(private router: Router, private store: Store, private snackbar: SnackbarService) {}

    ngOnInit(): void {
        this.lobbySubscription = this.lobby$.subscribe(async (lobby) => {
            if (lobby?.isActive) {
                const id = this.store.selectSnapshot<string>(LobbyState.lobbyId);
                await this.router.navigate([`${id}/game`]);
            }
        });
    }

    async startGame(): Promise<void> {
        if (this.store.selectSnapshot<Player[]>(PlayersState.players).length > 1) {
            const id = this.store.selectSnapshot<string>(LobbyState.lobbyId);
            await this.store.dispatch(new SetPlayerOrder(id));
            await this.store.dispatch(new UpdateLobby({ isActive: true, timer: Date.now() }));
        } else {
            this.snackbar.activateSnackbar(
                'Game cannot be started with only one player sdfjghkljdfj asdfkjakldfja asdfjkasdfjklaf jhjklhlk'
            );
        }
    }

    ngOnDestroy(): void {
        this.lobbySubscription.unsubscribe();
    }
}
