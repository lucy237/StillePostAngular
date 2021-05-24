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
    avatar =
        'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80';
    name = '';

    @Select(LobbyState.lobbyId)
    lobbyId$: Observable<string>;

    constructor(private router: Router, private store: Store) {}

    avatarChangedHandler(avatar: string): void {
        this.avatar = avatar;
    }

    ngOnInit(): void {
        if (localStorage.getItem('lobbyId') != null) {
            this.router.navigate([`${localStorage.getItem('lobbyId')}/waiting`]);
        }
    }

    async onSubmit(): Promise<any> {
        if (this.name === '') {
            alert('Please provide a name!');
        } else {
            localStorage.setItem('lobbyId', this.lobbyId);
            this.store.dispatch(new SetLobbyId(this.lobbyId));
            this.lobbyId$.subscribe(async (lobbyId) => {
                if (lobbyId) {
                  this.store.dispatch(new AddPlayer(lobbyId, this.name, this.avatar, false));

                }
                await this.router.navigate([`${this.lobbyId}/waiting`]);
            });
        }
    }
}
