import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LobbyState } from '../../../../store/lobby.state';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { debounceTime, takeWhile, tap } from 'rxjs/operators';
import { PlayersState } from '../../../../store/players.state.';
import { Lobby, Player } from '../../../shared/types/types';
import { Router } from '@angular/router';
import { AuthState } from '../../../../store/auth.state';
import { SaveRound, StartNewRound } from '../../../../store/lobby.actions';
import { StartComponent } from '../start/start.component';
import { DescriptionCanvasComponent } from '../description-canvas/description-canvas.component';
import { DrawingEditorComponent } from '../../../drawing-editor/components/drawing-editor/drawing-editor.component';
import { GameService } from '../../services/game.service';
import { RoundDrawingComponent } from '../round-drawing/round-drawing.component';
import { DbService } from '../../../shared/services/db.service';

@Component({
    selector: 'app-gamefield',
    templateUrl: './gamefield.component.html',
    styleUrls: ['./gamefield.component.scss'],
})
export class GamefieldComponent implements OnInit, OnDestroy {
    @Select(LobbyState.timer) timer$: Observable<number>;
    @Select(LobbyState.isFinished) isFinished$: Observable<boolean>;

    timespan = 12;
    currentTime = null;
    roundValue = null;
    lobbyId: string = null;
    lobby: Lobby = null;
    playerId: string = null;
    hostId: string = null;
    nextRoute: string = null;

    timeStampSubscription: Subscription = null;
    timerIntervalSubscription: Subscription = null;
    roundValueSubscription: Subscription = null;

    constructor(
        private store: Store,
        private router: Router,
        private gameService: GameService,
        private dbService: DbService
    ) {}

    async ngOnInit(): Promise<any> {
        this.lobbyId = this.store.selectSnapshot<string>(LobbyState.lobbyId);
        this.hostId = this.store.selectSnapshot<Player>(PlayersState.host).id;
        this.playerId = this.store.selectSnapshot<string>(AuthState.userId);
        this.lobby = this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);

        this.timeStampSubscription = this.timer$.subscribe((timestamp) => {
            if (timestamp !== null) {
                this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);

                // Round Logic - calculate next round route
                if (this.lobby.roundId + 1 < this.lobby.playerOrder.length) {
                    this.nextRoute = `${this.lobbyId}/game/${this.gameService.getNextRoute(this.lobby.roundId)}`;
                } else {
                    this.nextRoute = `/results`;
                }

                // Timer / play round
                this.currentTime = this.timespan;
                this.timerIntervalSubscription = interval(1000)
                    .pipe(takeWhile(() => this.currentTime > 0))
                    .subscribe(
                        () => {
                            this.currentTime = this.timespan - this.gameService.getSecondsSinceTimestamp(timestamp);
                            if (this.currentTime < 0) {
                                this.currentTime = 0;
                            }
                        },
                        () => {},
                        async () => {
                            this.saveRound();

                            if (this.playerId === this.hostId) {
                                this.store.dispatch(new StartNewRound(this.lobbyId));
                            }

                            await this.resetGameField();
                            await this.router.navigate([this.nextRoute]);
                        }
                    );
            }
        });
    }

    async saveRound(): Promise<void> {
        const currentAlbumPlayerId = this.gameService.getAlbumPlayerId(
            this.lobby.playerOrder,
            this.playerId,
            this.lobby.roundId
        );
        await this.store.dispatch(
            new SaveRound(this.lobbyId, currentAlbumPlayerId, {
                playerId: this.playerId,
                roundId: this.lobby.roundId,
                type: this.gameService.getRoundType(this.lobby.roundId),
                value: this.roundValue,
            })
        );
    }

    resetGameField(): void {
        this.currentTime = this.timespan;
        this.roundValue = '';
    }

    onActivate(componentReference: StartComponent | DrawingEditorComponent | DescriptionCanvasComponent): void {
        if (componentReference instanceof RoundDrawingComponent) {
            this.roundValueSubscription = componentReference.drawingChanged.subscribe((params) => {
                this.roundValue = params.base64;
            });
        } else if (
            componentReference instanceof DescriptionCanvasComponent ||
            componentReference instanceof StartComponent
        ) {
            this.roundValueSubscription = componentReference.descriptionChanged.subscribe((description) => {
                this.roundValue = description;
            });
        }
    }

    delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnDestroy(): void {
        this.timeStampSubscription.unsubscribe();
        this.roundValueSubscription.unsubscribe();
    }
}
