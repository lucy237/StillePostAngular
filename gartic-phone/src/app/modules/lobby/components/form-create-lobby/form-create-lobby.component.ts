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

    avatar =
        'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80';
    name = '';

    constructor(private router: Router, private store: Store) {}

    avatarChangedHandler(avatar: string): void {
        this.avatar = avatar;
    }

    ngOnInit(): void {}

    async onSubmit(): Promise<any> {
        if (this.name === '') {
            alert('Please provide a name!');
        } else {
            await this.store.dispatch([new CreateLobby()]);
            this.lobbyId$.subscribe(async (id) => {
                if (id) {
                    await this.store.dispatch(new AddPlayer(id, this.name, this.avatar, true));
                    await this.router.navigate([`${id}/waiting`]);
                }
            });
        }
    }
}
