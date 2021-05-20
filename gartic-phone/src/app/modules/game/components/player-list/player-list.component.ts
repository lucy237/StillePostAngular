import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Lobby, LobbyState, Player } from '../../../../store/lobby.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
    @Select(LobbyState.lobby)
    lobby$: Observable<Lobby>;

    @Select(LobbyState.players)
    players$: Observable<Player[]>;

    lobbyId = '';
    constructor() {}

    ngOnInit(): void {}
}
