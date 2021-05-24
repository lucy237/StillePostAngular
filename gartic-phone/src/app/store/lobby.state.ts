import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CreateLobby, SetLobby, SetLobbyId, UpdateLobby } from './lobby.actions';
import { Lobby } from '../modules/shared/types/types';
import { DbService } from '../modules/shared/services/db.service';
import { tap } from 'rxjs/operators';

interface LobbyStateModel {
    id: string;
    lobby: Lobby;
}

@State<LobbyStateModel>({
    name: 'lobbyState',
    defaults: {
        id: null,
        lobby: { created: null, maxSize: 8, isFull: false, isActive: false, isFinished: false, timer: null },
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
        const id = localStorage.getItem('lobby-id');
        if (id) {
            this.dbService
                .getLobby(id)
                .valueChanges()
                .pipe(
                    tap((lobby) => {
                        context.dispatch(new SetLobby(id, lobby));
                    })
                )
                .subscribe();
        }
    }

    @Action(CreateLobby)
    async createLobby(context: StateContext<LobbyStateModel>): Promise<any> {
        this.dbService
            .createLobby()
            .then((doc) => {
                localStorage.setItem('lobby-id', doc.id);
                context.dispatch(new SetLobbyId(doc.id));
                this.dbService
                    .getLobby(doc.id)
                    .valueChanges()
                    .pipe(
                        tap((lobby) => {
                            context.dispatch(new SetLobby(doc.id, lobby));
                        })
                    )
                    .subscribe();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    @Action(UpdateLobby)
    async updateLobby(context: StateContext<LobbyStateModel>, action: UpdateLobby): Promise<any> {
        const lobbyId = context.getState().id;
        this.dbService.updateLobby(lobbyId, action.data).catch((error) => {
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
