import { Player } from '../modules/shared/types/types';

export class SetPlayers {
    static readonly type = '[Players] SetPlayers';

    constructor(public players: Player[]) {}
}

export class AddPlayer {
    static readonly type = '[Players] AddPlayer';

    constructor(public lobbyId: string, public name: string, public avatar: string, public isHost: boolean) {}
}
