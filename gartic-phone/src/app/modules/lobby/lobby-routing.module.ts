import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormJoinLobbyComponent } from './components/form-join-lobby/form-join-lobby.component';
import { FormCreateLobbyComponent } from './components/form-create-lobby/form-create-lobby.component';
import { WaitingComponent } from './components/waiting/waiting.component';

const routes: Routes = [
    {
        path: '',
        component: FormJoinLobbyComponent,
    },
    {
        path: 'create',
        component: FormCreateLobbyComponent,
    },
    {
        path: ':id/waiting',
        component: WaitingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LobbyRoutingModule {}
