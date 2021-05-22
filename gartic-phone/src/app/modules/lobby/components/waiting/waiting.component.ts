import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Lobby, Player } from '../../../shared/types/types';
import { LobbyState } from '../../../../store/lobby.state';
import { PlayersState } from '../../../../store/players.state.';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit {
    @Select(LobbyState.lobbyId)
    lobbyId$: Observable<string>;

    @Select(LobbyState.lobby)
    lobby$: Observable<Lobby>;

    @Select(PlayersState.players)
    players$: Observable<Player[]>;

    constructor() {}

    ngOnInit(): void {}
}
