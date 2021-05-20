import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormJoinLobbyComponent } from './components/form-join-lobby/form-join-lobby.component';
import { LobbyRoutingModule } from './lobby-routing.module';
import { FormCreateLobbyComponent } from './components/form-create-lobby/form-create-lobby.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { LobbyState } from '../../store/lobby.state';
import { WaitingComponent } from './components/waiting/waiting.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { GameRoutingModule } from '../game/game-routing.module';

@NgModule({
    declarations: [FormJoinLobbyComponent, FormCreateLobbyComponent, WaitingComponent, CarouselComponent],
    imports: [CommonModule, LobbyRoutingModule, FormsModule, GameRoutingModule, NgxsModule.forFeature([LobbyState])],
})
export class LobbyModule {}
