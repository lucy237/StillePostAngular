import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LobbyState } from '../../../../store/lobby.state';
import { interval, Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
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
    @Select(LobbyState.roundId) roundId$: Observable<number>;
    @Select(LobbyState.resultCounter) resultCounter$: Observable<number>;

    timespan = 5;
    currentTime = this.timespan;
    roundValue = null;
    lobbyId: string = null;
    lobby: Lobby = null;
    playerId: string = null;
    players: Player[] = null;
    nextRoute: string = null;
    isLoading = false;

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
        this.playerId = this.store.selectSnapshot<string>(AuthState.userId);
        this.players = this.store.selectSnapshot<Player[]>(PlayersState.players);
        this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);

        this.isFinished$.subscribe(async (isFinished) => {
            if (isFinished) {
                await this.router.navigate(['/results']);
            }
        });

        this.resultCounter$.subscribe(async (counter) => {
            if (counter === this.players.length) {
                if (this.playerId === this.store.selectSnapshot<Player>(PlayersState.host).id) {
                    await this.store.dispatch(new StartNewRound(this.lobbyId));
                }
                this.resetGameField();
                await this.router.navigate([this.nextRoute]);
            }
        });

        this.timeStampSubscription = this.timer$.subscribe(async (timestamp) => {
            if (timestamp !== null) {
                this.lobby = this.store.selectSnapshot<Lobby>(LobbyState.lobby);
                if (this.gameService.isNotLastRound()) {
                    this.nextRoute = `${this.lobbyId}/game/${this.gameService.getNextRoute(this.lobby.roundId)}`;
                }

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
                            await this.router.navigate([`${this.lobbyId}/game/loading`]);
                            await this.saveRound();
                        }
                    );
            }
        });
    }

    async saveRound(): Promise<void> {
        const currentAlbumPlayerId = this.gameService.getAlbumPlayerId(this.playerId);
        await this.store.dispatch(
            new SaveRound(this.lobbyId, currentAlbumPlayerId, {
                playerId: this.playerId,
                roundId: this.lobby.roundId,
                type: this.gameService.getRoundType(this.lobby.roundId),
                value: this.roundValue,
            })
        );
        await this.dbService.incrementResultCounter(this.lobbyId);
    }

    resetGameField(): void {
        this.currentTime = this.timespan;
        this.roundValue = '';
    }

    onActivate(componentReference: StartComponent | DrawingEditorComponent | DescriptionCanvasComponent): void {
        // we use this to ensure that the timer is unsubscribed before we start a new round
        if (this.timerIntervalSubscription) {
            this.timerIntervalSubscription.unsubscribe();
        }

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

    ngOnDestroy(): void {
        this.timeStampSubscription.unsubscribe();
        this.roundValueSubscription.unsubscribe();
    }
}
