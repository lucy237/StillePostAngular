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

    getLastPlayerId(playerOrder: string[], playerId: string): string {
        const ownIndex = playerOrder.indexOf(playerId);
        let lastPlayerIndex = ownIndex - 1;
        if (lastPlayerIndex < 0) {
            lastPlayerIndex = playerOrder.length - 1;
        }
        return playerOrder[lastPlayerIndex];
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
