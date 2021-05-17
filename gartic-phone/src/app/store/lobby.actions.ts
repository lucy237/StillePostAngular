import { Lobby, Player } from './lobby.state';

export class CreateLobby {
    static readonly type = '[Lobby] CreateLobby';

    constructor(public playerName: string, public playerAvatar: string) {}
}

export class UpdateLobby {
    static readonly type = '[Lobby] UpdateLobby';

    constructor(public lobbyId: string, public playerName: string, public playerAvatar: string) {}
}

export class DeleteLobby {
    static readonly type = '[Lobby] DeleteLobby';

    constructor(public id: string) {}
}

export class SetLobby {
    static readonly type = '[Lobby] SetLobby';

    constructor(public id: string, public lobby: Lobby) {}
}

export class SetPlayers {
    static readonly type = '[Lobby] SetPlayers';

    constructor(public id: string, public players: Player[]) {}
}
