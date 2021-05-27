import { Injectable } from '@angular/core';
import { RoundType } from '../../shared/types/types';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    constructor() {}

    getAlbumPlayerId(playerOrder: string[], playerId: string, roundId: number): string {
        let albumIndex = playerOrder.indexOf(playerId) + roundId;
        if (albumIndex > playerOrder.length - 1) {
            albumIndex = albumIndex - playerOrder.length;
        }
        return playerOrder[albumIndex];
    }

    getSecondsSinceTimestamp(timestamp): number {
        return Math.floor((Date.now() - timestamp) / 1000);
    }

    getRoundType(roundId: number): number {
        return roundId % 2 === 0 ? RoundType.description : RoundType.drawing;
    }

    getNextRoute(roundId: number): string {
        console.log(roundId);
        return this.getRoundType(roundId) === RoundType.drawing ? 'describe' : 'draw';
    }
}
