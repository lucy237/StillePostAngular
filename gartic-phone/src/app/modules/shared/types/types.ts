export enum RoundType {
    drawing,
    description,
}

export interface Round {
    roundId: number;
    playerId: string;
    type: RoundType;
    value: string;
}

export interface Player {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    album: Round[];
}

export interface Lobby {
    created: Date;
    maxSize: number;
    isFull: boolean;
    isActive: boolean;
    isFinished: boolean;
    roundId: number;
    timer: number;
    playerOrder: string[];
}
