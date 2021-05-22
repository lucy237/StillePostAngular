import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { of } from 'rxjs';
import { Player } from '../modules/shared/types/types';
import { switchMap, tap } from 'rxjs/operators';
import { LobbyState } from './lobby.state';
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

    constructor(private store: Store, private dbService: DbService) {}

    ngxsOnInit(context?: StateContext<PlayersStateModel>): void {
        this.store
            .select(LobbyState.lobbyId)
            .pipe(
                switchMap((lobbyId) => {
                    if (lobbyId === null) {
                        return of(null);
                    } else {
                        return this.dbService
                            .getPlayersCollection(lobbyId)
                            .valueChanges()
                            .pipe(
                                tap((players) => {
                                    context.dispatch(new SetPlayers(players));
                                })
                            );
                    }
                })
            )
            .subscribe();
    }

    @Action(AddPlayer)
    async addPlayer(context: StateContext<PlayersStateModel>, action: AddPlayer): Promise<void> {
        const playerId = this.store.selectSnapshot(AuthState.userId);
        return this.dbService.addPlayer(action.lobbyId, playerId, action.player);
    }

    @Action(SetPlayers)
    setPlayers(context: StateContext<PlayersStateModel>, action: SetPlayers): void {
        context.patchState({
            players: action.players,
        });
    }
}
