import { Lobby } from '../modules/shared/types/types';

export class CreateLobby {
    static readonly type = '[Lobby] CreateLobby';

    constructor() {}
}

export class SetLobbyId {
    static readonly type = '[Lobby] SetLobbyId';

    constructor(public id: string) {}
}

export class SetLobby {
    static readonly type = '[Lobby] SetLobby';

    constructor(public id: string, public lobby: Lobby) {}
}
