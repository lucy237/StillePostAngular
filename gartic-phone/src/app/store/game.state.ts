import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { of } from 'rxjs';
import { Album } from '../modules/shared/types/types';
import { switchMap, tap } from 'rxjs/operators';
import { LobbyState } from './lobby.state';
import { DbService } from '../modules/shared/services/db.service';
import { SetAlbums } from './game.actions';

interface GameStateModel {
    albums: Album[];
}

@State<GameStateModel>({
    name: 'playersState',
    defaults: {
        albums: [],
    },
})
@Injectable()
export class GameState implements NgxsOnInit {
    @Selector()
    static albums(state: GameStateModel): Album[] {
        return state.albums;
    }

    constructor(private store: Store, private dbService: DbService) {}

    ngxsOnInit(context?: StateContext<GameStateModel>): void {
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
                                    const albums = [];
                                    players.forEach((player) => {
                                        albums.push(player.album);
                                    });
                                    context.dispatch(new SetAlbums(albums));
                                })
                            );
                    }
                })
            )
            .subscribe();
    }

    @Action(SetAlbums)
    setAlbums(context: StateContext<GameStateModel>, action: SetAlbums): void {
        context.patchState({
            albums: action.albums,
        });
    }
}
