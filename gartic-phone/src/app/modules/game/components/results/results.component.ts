import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { LobbyState } from '../../../../store/lobby.state';
import { Observable } from 'rxjs';
import { PlayersState } from '../../../../store/players.state.';
import { Lobby, Player } from '../../../shared/types/types';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
    @Select(LobbyState.lobby)
    lobby$: Observable<Lobby>;

    @Select(PlayersState.players)
    players$: Observable<Player[]>;

    lobbyId = '';
    constructor() {}

    ngOnInit(): void {}
}
