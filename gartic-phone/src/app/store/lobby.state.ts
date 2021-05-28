import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
    CreateLobby,
    SetLobby,
    SetLobbyId,
    SetPlayerOrder,
    SaveRound,
    UpdateLobby,
    StartNewRound,
} from './lobby.actions';
import { Lobby, Player } from '../modules/shared/types/types';
import { DbService } from '../modules/shared/services/db.service';
import { tap } from 'rxjs/operators';
import { PlayersState } from './players.state.';

interface LobbyStateModel {
    id: string;
    lobby: Lobby;
}

@State<LobbyStateModel>({
    name: 'lobbyState',
    defaults: {
        id: null,
        lobby: {
            created: null,
            maxSize: 8,
            isFull: false,
            isActive: false,
            isFinished: false,
            resultCounter: 0,
            roundId: 0,
            timer: null,
            playerOrder: [],
        },
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

    @Selector()
    static timer(state: LobbyStateModel): number {
        return state.lobby.timer;
    }

    @Selector()
    static roundId(state: LobbyStateModel): number {
        return state.lobby.roundId;
    }

    @Selector()
    static playerOrder(state: LobbyStateModel): string[] {
        return state.lobby.playerOrder;
    }
    @Selector()
    static resultCounter(state: LobbyStateModel): number {
        return state.lobby.resultCounter;
    }

    @Selector()
    static isFinished(state: LobbyStateModel): boolean {
        return state.lobby.isFinished;
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
            })
            .catch((error) => {
                // show snackbar with error message
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

    @Action(SetPlayerOrder)
    async setPlayerOrder(context: StateContext<LobbyStateModel>): Promise<any> {
        const lobbyId = context.getState().id;
        const players = this.store.selectSnapshot(PlayersState.players);
        const playerOrder: string[] = [];
        players.forEach((player) => {
            playerOrder.push(player.id);
        });

        this.dbService.updateLobby(lobbyId, { playerOrder }).catch((error) => {
            console.error(error);
        });
    }

    @Action(SaveRound)
    async saveRound(context: StateContext<LobbyStateModel>, action: SaveRound): Promise<any> {
        const lobbyId = context.getState().id;
        this.dbService.setRound(lobbyId, action.playerId, action.round).catch((error) => {
            console.error(error);
        });
    }

    @Action(StartNewRound)
    async startNewRound(context: StateContext<LobbyStateModel>, action: StartNewRound): Promise<any> {
        const newRoundId = context.getState().lobby.roundId + 1;
        const playerCount = this.store.selectSnapshot<Player[]>(PlayersState.players).length;
        if (newRoundId < playerCount) {
            this.dbService
                .updateLobby(action.lobbyId, { roundId: newRoundId, timer: Date.now(), resultCounter: 0 })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            this.dbService.updateLobby(action.lobbyId, { isFinished: true }).catch((error) => {
                console.error(error);
            });
        }
    }

    @Action(SetLobbyId)
    setLobbyId(context: StateContext<LobbyStateModel>, action: SetLobbyId): void {
        this.dbService
            .getLobby(action.id)
            .valueChanges()
            .pipe(
                tap((lobby) => {
                    context.dispatch(new SetLobby(action.id, lobby));
                })
            )
            .subscribe();

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
