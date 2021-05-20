import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Lobby, LobbyState, Player } from '../../../../store/lobby.state';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit {
    @Select(LobbyState.lobby)
    lobby$: Observable<Lobby>;

    @Select(LobbyState.players)
    players$: Observable<Player[]>;

    lobbyId = '';

    constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params) => {
            if (params.has('id')) {
                this.lobbyId = params.get('id');
                // TODO: get player data from store
            }
        });
    }
}
