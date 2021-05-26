import { Lobby, Round } from '../modules/shared/types/types';

export class CreateLobby {
    static readonly type = '[Lobby] CreateLobby';

    constructor() {}
}

export class UpdateLobby {
    static readonly type = '[Lobby] UpdateLobby';

    constructor(public data: Partial<Lobby>) {}
}

export class SetLobbyId {
    static readonly type = '[Lobby] SetLobbyId';

    constructor(public id: string) {}
}

export class SetLobby {
    static readonly type = '[Lobby] SetLobby';

    constructor(public id: string, public lobby: Lobby) {}
}

export class SetPlayerOrder {
    static readonly type = '[Lobby] SetPlayerOrder';

    constructor(public lobbyId: string) {}
}

export class SaveRound {
    static readonly type = '[Lobby] SaveRound';

    constructor(public lobbyId: string, public playerId: string, public round: Round) {}
}

export class StartNewRound {
    static readonly type = '[Lobby] StartNewRound';

    constructor(public lobbyId: string) {}
}
