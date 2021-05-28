import { Injectable } from '@angular/core';
import { Lobby, RoundType } from '../../shared/types/types';
import { Select } from '@ngxs/store';
import { LobbyState } from '../../../store/lobby.state';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    @Select(LobbyState.lobby) lobby$: Observable<Lobby>;
    lobby: Lobby = null;

    constructor() {
        this.lobby$.subscribe((newLobby) => {
            this.lobby = newLobby;
            console.log(newLobby);
        });
    }

    getAlbumPlayerId(playerId: string): string {
        let albumIndex = this.lobby.playerOrder.indexOf(playerId) + this.lobby.roundId;
        if (albumIndex > this.lobby.playerOrder.length - 1) {
            albumIndex = albumIndex - this.lobby.playerOrder.length;
        }
        return this.lobby.playerOrder[albumIndex];
    }

    getLastPlayerId(playerId: string): string {
        const ownIndex = this.lobby.playerOrder.indexOf(playerId);
        let lastPlayerIndex = ownIndex - 1;
        if (lastPlayerIndex < 0) {
            lastPlayerIndex = this.lobby.playerOrder.length - 1;
        }
        return this.lobby.playerOrder[lastPlayerIndex];
    }

    isNotLastRound(): boolean {
        return this.lobby.roundId < this.lobby.playerOrder.length - 1;
    }

    getSecondsSinceTimestamp(timestamp): number {
        return Math.floor((Date.now() - timestamp) / 1000);
    }

    getRoundType(roundId: number): number {
        return roundId % 2 === 0 ? RoundType.description : RoundType.drawing;
    }

    getNextRoute(roundId: number): string {
        return this.getRoundType(roundId) === RoundType.drawing ? 'describe' : 'draw';
    }
}
