import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { CreateLobby } from '../../../../store/lobby.actions';
import { LobbyState } from '../../../../store/lobby.state';
import { Observable } from 'rxjs';
import { AddPlayer } from '../../../../store/players.actions';

@Component({
    selector: 'app-form-create-lobby',
    templateUrl: './form-create-lobby.component.html',
    styleUrls: ['./form-create-lobby.component.scss'],
})
export class FormCreateLobbyComponent implements OnInit {
    @Select(LobbyState.lobbyId)
    lobbyId$: Observable<string>;

    avatar = 'dasf.jpg';
    name = '';

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {}

    async onSubmit(): Promise<any> {
        await this.store.dispatch([new CreateLobby()]);
        this.lobbyId$.subscribe(async (id) => {
            if (id) {
                await this.store.dispatch(new AddPlayer(id, this.name, this.avatar, true));
                await this.router.navigate([`${id}/waiting`]);
            }
        });
    }
}
