import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { RoundType } from '../../shared/types/types';

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAlbumPlayerId', () => {
        const playerOrder = ['first', 'second', 'third'];
        it('should be own player id in 1st round', () => {
            expect(service.getAlbumPlayerId(playerOrder, 'second', 0)).toBe('second');
        });

        it('should be the next player id in 2nd round', () => {
            expect(service.getAlbumPlayerId(playerOrder, 'second', 1)).toBe('third');
        });

        it('should be the first player id in 3rd round', () => {
            expect(service.getAlbumPlayerId(playerOrder, 'third', 2)).toBe('first');
        });
    });

    describe('getRoundType', () => {
        it('should be type type `description`', () => {
            expect(service.getRoundType(0)).toBe(RoundType.description);
            expect(service.getRoundType(4)).toBe(RoundType.description);
        });

        it('should be type type `drawing`', () => {
            expect(service.getRoundType(5)).toBe(RoundType.description);
        });
    });

    describe('getNextRoute', () => {
        it('should be `draw`', () => {
            expect(service.getNextRoute(2)).toBe('describe');
        });

        it('should be `describe`', () => {
            expect(service.getNextRoute(3)).toBe('draw');
        });
    });
});
