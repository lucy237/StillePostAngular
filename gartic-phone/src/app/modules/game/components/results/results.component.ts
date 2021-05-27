import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { LobbyState } from '../../../../store/lobby.state';
import { Observable, Subscription } from 'rxjs';
import { PlayersState } from '../../../../store/players.state.';
import { Lobby, Player } from '../../../shared/types/types';
import { AuthState } from '../../../../store/auth.state';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    animations: [
        trigger('carouselAnimation', [
            transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
            transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class ResultsComponent implements OnInit {
    @Select(AuthState.userId) playerId$: Observable<string>;
    @Select(LobbyState.lobbyId) lobbyId$: Observable<string>;
    @Select(LobbyState.lobby) lobby$: Observable<Lobby>;
    @Select(PlayersState.players) players$: Observable<Player[]>;
    @Select(PlayersState.host) host$: Observable<Player>;

    public albums = [{}];

    /*
  results: Array<Round[]> = [
    [
      {
        roundId: 0,
        playerId: 'asfd',
        type: RoundType.description,
        value: 'initial funny text',
      },
      {
        roundId: 1,
        playerId: '234as',
        type: RoundType.drawing,
        value: 'base64 string',
      },
    ],
    [
      {
        roundId: 0,
        playerId: 'asfd',
        type: RoundType.description,
        value: 'initial funny text',
      },
      {
        roundId: 1,
        playerId: '234as',
        type: RoundType.drawing,
        value: 'base64 string',
      },
    ],
  ];
*/

    lobbyId = '';
    currentAlbum = 0;
    constructor() {}

    ngOnInit(): void {}

    onPreviousClick(): void {
        const previous = this.currentAlbum - 1;
        this.currentAlbum = previous < 0 ? this.albums.length - 1 : previous;
        console.log('previous clicked, new current Album is: ', this.currentAlbum);
        //this.updateCurrentAvatar();
    }

    onNextClick(): void {
        const next = this.currentAlbum + 1;
        this.currentAlbum = next === this.albums.length ? 0 : next;
        console.log('next clicked, new current album is: ', this.currentAlbum);
        //this.updateCurrentAvatar();
    }
}
