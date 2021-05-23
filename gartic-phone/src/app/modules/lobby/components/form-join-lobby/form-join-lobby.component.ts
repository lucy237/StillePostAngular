import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SetLobbyId } from '../../../../store/lobby.actions';
import { Router } from '@angular/router';
import { LobbyState } from '../../../../store/lobby.state';
import { Observable } from 'rxjs';
import { AddPlayer } from '../../../../store/players.actions';

@Component({
    selector: 'app-form-join-lobby',
    templateUrl: './form-join-lobby.component.html',
    styleUrls: ['./form-join-lobby.component.scss'],
})
export class FormJoinLobbyComponent implements OnInit {
    lobbyId = '';
    avatar = 'asdf.jpg';
    name = '';

    @Select(LobbyState.lobbyId)
    lobbyId$: Observable<string>;

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {}

    async onSubmit(): Promise<any> {
        this.store.dispatch(new SetLobbyId(this.lobbyId));
        this.lobbyId$.subscribe(async (lobbyId) => {
            if (lobbyId) {
                this.store.dispatch(new AddPlayer(lobbyId, this.name, this.avatar, false));
            }
            await this.router.navigate([`${this.lobbyId}/waiting`]);
        });
    }
}
