import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UpdateLobby } from '../../../../store/lobby.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-form-join-lobby',
    templateUrl: './form-join-lobby.component.html',
    styleUrls: ['./form-join-lobby.component.scss'],
})
export class FormJoinLobbyComponent implements OnInit {
    lobbyId = '';
    avatar = 'asdf.jpg';
    name = '';

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {}

    onSubmit(): void {
        this.store.dispatch(new UpdateLobby(this.lobbyId, this.name, this.avatar)).subscribe(async () => {
            await this.router.navigate([`${this.lobbyId}/waiting`]);
        });
    }
}
