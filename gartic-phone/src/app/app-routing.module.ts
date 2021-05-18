import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamefieldComponent } from './modules/game/components/gamefield/gamefield.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/lobby/lobby.module').then((m) => m.LobbyModule),
    },
    {
        path: 'game',
        //component: GamefieldComponent,
        loadChildren: () => import('./modules/game/game.module').then((m) => m.GameModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
