import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { CreateLobby, SetLobby, SetLobbyId } from './lobby.actions';
import { Lobby } from '../modules/shared/types/types';
import { DbService } from '../modules/shared/services/db.service';
import { switchMap, tap } from 'rxjs/operators';

interface LobbyStateModel {
    id: string;
    lobby: Lobby;
}

@State<LobbyStateModel>({
    name: 'lobbyState',
    defaults: {
        id: null,
        lobby: { created: null, maxSize: 8, isFull: false, isFinished: false, timer: null },
    },
})
@Injectable()
export class LobbyState implements NgxsOnInit {
    @Selector()
    static lobbyId(state: LobbyStateModel): string {
        return state.id;
    }

    @Selector()
    static lobby(state: LobbyStateModel): Lobby {
        return state.lobby;
    }

    constructor(private store: Store, private dbService: DbService) {}

    ngxsOnInit(context?: StateContext<LobbyStateModel>): void {
        // TODO: find a different reference to own lobbyId Selector - simplify all of this
        this.store
            .select(LobbyState.lobbyId)
            .pipe(
                switchMap((lobbyId) => {
                    if (lobbyId === null) {
                        return of(null);
                    } else {
                        return this.dbService
                            .getLobby(lobbyId)
                            .valueChanges()
                            .pipe(
                                tap((lobby) => {
                                    context.dispatch(new SetLobby(lobbyId, lobby));
                                })
                            );
                    }
                })
            )
            .subscribe();
    }

    @Action(CreateLobby)
    async createLobby(context: StateContext<LobbyStateModel>): Promise<any> {
        this.dbService
            .createLobby()
            .then((doc) => {
                context.dispatch(new SetLobbyId(doc.id));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    @Action(SetLobbyId)
    setLobbyId(context: StateContext<LobbyStateModel>, action: SetLobbyId): void {
        context.patchState({
            id: action.id,
        });
    }

    @Action(SetLobby)
    setLobby(context: StateContext<LobbyStateModel>, action: SetLobby): void {
        context.patchState({
            id: action.id,
            lobby: action.lobby,
        });
    }
}
