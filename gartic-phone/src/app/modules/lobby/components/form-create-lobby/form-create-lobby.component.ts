import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CreateLobby } from '../../../../store/lobby.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-form-create-lobby',
    templateUrl: './form-create-lobby.component.html',
    styleUrls: ['./form-create-lobby.component.scss'],
})
export class FormCreateLobbyComponent implements OnInit {
    avatar = 'dasf.jpg';
    name = '';

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {}

    onSubmit(): void {
        this.store.dispatch(new CreateLobby(this.name, this.avatar)).subscribe(async () => {
            await this.router.navigate(['waiting']);
        });
    }
}
