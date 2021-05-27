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

    timespan = 20;
    currentTime = this.timespan;
    lastRoundValue = null;
    roundValue = null;
    lobbyId: string = null;
    lobby: Lobby = null;
    playerId: string = null;
    hostId: string = null;

    timerSubscription: Subscription = null;
    timerIntervalSubscription: Subscription = null;
    roundValueSubscription: Subscription = null;
    isFinishedSubscription: Subscription = null;
    getRoundFromPlayerSubscription: Subscription = null;

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

        this.isFinishedSubscription = this.isFinished$.subscribe(async (isFinished) => {
            if (isFinished) {
                await this.router.navigate(['results']);
            }
        });

        this.timerSubscription = this.timer$.subscribe((timestamp) => {
            this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);
            if (timestamp !== null) {
                // timer logic
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
                            this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);
                            await this.saveRound();
                            if (this.playerId === this.hostId) {
                                timer(3000).subscribe(async () => {
                                    await this.store.dispatch(new StartNewRound(this.lobbyId));
                                });
                            }
                            timer(4000).subscribe(() => {
                                // go to next round logic
                                if (!this.store.selectSnapshot<boolean>(LobbyState.isFinished)) {
                                    const lastPlayerId = this.gameService.getLastPlayerId(
                                        this.lobby.playerOrder,
                                        this.playerId
                                    );
                                    this.getRoundFromPlayerSubscription = this.dbService
                                        .getLastRoundFromPlayer(this.lobbyId, lastPlayerId)
                                        .subscribe(async (round) => {
                                            if (!this.store.selectSnapshot<boolean>(LobbyState.isFinished)) {
                                                if (round[0]?.value) {
                                                    this.lastRoundValue = round[0]?.value;
                                                }
                                                const nextRoute = this.gameService.getNextRoute(this.lobby.roundId - 1);
                                                await this.router.navigate([`${this.lobbyId}/game/${nextRoute}`]);
                                                this.resetGameField();
                                            }
                                        });
                                }
                            });
                        }
                    );
                this.timerIntervalSubscription.unsubscribe();
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
            componentReference.setDescription(this.lastRoundValue);
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

    ngOnDestroy(): void {
        this.timerSubscription.unsubscribe();
        this.timerIntervalSubscription.unsubscribe();
        this.roundValueSubscription.unsubscribe();
        this.getRoundFromPlayerSubscription.unsubscribe();
    }
}
