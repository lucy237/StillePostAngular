import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { Player } from '../modules/shared/types/types';
import { tap } from 'rxjs/operators';
import { AddPlayer, SetPlayers } from './players.actions';
import { DbService } from '../modules/shared/services/db.service';

interface PlayersStateModel {
    players: Player[];
}

@State<PlayersStateModel>({
    name: 'playersState',
    defaults: {
        players: [],
    },
})
@Injectable()
export class PlayersState implements NgxsOnInit {
    @Selector()
    static players(state: PlayersStateModel): Player[] {
        return state.players;
    }

    @Selector()
    static host(state: PlayersStateModel): Player {
        return state.players.find((player) => player.isHost);
    }

    constructor(private store: Store, private dbService: DbService) {}

    ngxsOnInit(context?: StateContext<PlayersStateModel>): void {
        const id = localStorage.getItem('lobby-id');
        if (id) {
            this.dbService
                .getPlayersCollection(id)
                .valueChanges()
                .pipe(
                    tap((players) => {
                        context.dispatch(new SetPlayers(players));
                    })
                )
                .subscribe();
        }
    }

    @Action(AddPlayer)
    async addPlayer(context: StateContext<PlayersStateModel>, action: AddPlayer): Promise<void> {
        const playerId = this.store.selectSnapshot(AuthState.userId);
        this.dbService
            .addPlayer(action.lobbyId, {
                id: playerId,
                name: action.name,
                avatar: action.avatar,
                isHost: action.isHost,
            })
            .then(() => {
                localStorage.setItem('lobby-id', action.lobbyId);
                this.dbService
                    .getPlayersCollection(action.lobbyId)
                    .valueChanges()
                    .pipe(
                        tap((players) => {
                            context.dispatch(new SetPlayers(players));
                        })
                    )
                    .subscribe();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    @Action(SetPlayers)
    setPlayers(context: StateContext<PlayersStateModel>, action: SetPlayers): void {
        context.patchState({
            players: action.players,
        });
    }
}
