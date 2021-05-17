import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthState } from './auth.state';
import { from, Observable, of } from 'rxjs';
import { CreateLobby, SetLobby, SetPlayers, UpdateLobby } from './lobby.actions';
import { generateLobbyCode } from '../modules/lobby/utils/lobby-code';
import { switchMap, tap } from 'rxjs/operators';
import { SetTodos } from './todo.actions';
import { TodoInterface, TodoStateModel } from './todo.state';

export interface Player {
    name: string;
    avatar: string;
    isHost: boolean;
}

export interface Lobby {
    created: Date;
    maxSize: number;
    players: Array<Player>;
    rounds: Array<string>; // TODO: think of a way to nicely structure and save the game details (paintings, descriptions)
    isFull: boolean;
    isFinished: boolean;
}

interface LobbyStateModel {
    id: string;
    lobby: Lobby;
    players: Player[];
}

@State<LobbyStateModel>({
    name: 'lobbyState',
    defaults: {
        id: null,
        lobby: { created: null, maxSize: 8, players: [], rounds: [], isFull: false, isFinished: false },
        players: [],
    },
})
@Injectable()
export class LobbyState implements NgxsOnInit {
    @Selector()
    static lobby(state: LobbyStateModel): Lobby {
        return state.lobby;
    }

    @Selector()
    static players(state: LobbyStateModel): Player[] {
        return state.players;
    }

    constructor(private angularFirestore: AngularFirestore, private store: Store) {}

    ngxsOnInit(context?: StateContext<any>): void {
        const playerId = AuthState.userId;
        this.store
            .select(playerId)
            .pipe(
                switchMap((userId) => {
                    if (userId === null) {
                        return of(null);
                    } else {
                        return this.angularFirestore
                            .collection('lobbies')
                            .doc<Lobby>('4WINWM')
                            .valueChanges()
                            .pipe(
                                tap((lobby) => {
                                    console.log(lobby);
                                    context.dispatch(new SetLobby('4WINWM', lobby));
                                })
                            );
                    }
                })
            )
            .subscribe();

        this.store
            .select(playerId)
            .pipe(
                switchMap((userId) => {
                    if (userId === null) {
                        return of(null);
                    } else {
                        return this.getLobby('4WINWM')
                            .collection('players')
                            .valueChanges()
                            .pipe(
                                tap((players) => {
                                    console.log(players);
                                    context.dispatch(new SetPlayers('4WINWM', players as Player[]));
                                })
                            );
                    }
                })
            )
            .subscribe();
    }

    @Action(CreateLobby)
    createLobby(context: StateContext<LobbyStateModel>, action: CreateLobby): Observable<any> {
        const now = new Date(); // TODO: store other useful information to the db
        const lobbyId = generateLobbyCode(); // TODO: check if code isn't yet in the db
        const playerId = this.getPlayerId();
        // TODO: refactor this!
        this.getPlayer(lobbyId, playerId).set({
            name: action.playerName,
            avatar: action.playerAvatar,
            isHost: true,
        });
        return from(
            this.getLobby(lobbyId).set({
                created: now,
                maxSize: 8,
                isFull: false,
                isFinished: false,
                rounds: [],
            })
        );
    }

    @Action(UpdateLobby)
    updateLobby(context: StateContext<LobbyStateModel>, action: UpdateLobby): Observable<any> {
        const playerId = this.getPlayerId();
        return from(
            this.getPlayer(action.lobbyId, playerId).set({
                name: action.playerName,
                avatar: action.playerAvatar,
                isHost: false,
            })
        );
    }

    @Action(SetLobby)
    setLobby(context: StateContext<LobbyStateModel>, action: SetLobby): void {
        context.patchState({
            id: action.id,
            lobby: action.lobby,
        });
    }

    @Action(SetPlayers)
    setPlayer(context: StateContext<LobbyStateModel>, action: SetPlayers): void {
        context.patchState({
            players: action.players,
        });
    }

    private getPlayerId(): string {
        return this.store.selectSnapshot(AuthState.userId);
    }

    private getLobby(lobbyId: string): AngularFirestoreDocument<any> {
        return this.angularFirestore.collection('lobbies').doc(lobbyId);
    }

    private getPlayer(lobbyId: string, playerId: string): AngularFirestoreDocument<Player> {
        return this.getLobby(lobbyId).collection('players').doc(playerId);
    }
}
