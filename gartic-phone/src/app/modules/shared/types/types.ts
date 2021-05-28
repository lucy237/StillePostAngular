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
}

export interface Lobby {
    created: Date;
    maxSize: number;
    isFull: boolean;
    isActive: boolean;
    isFinished: boolean;
    resultCounter: number;
    roundId: number;
    timer: number;
    playerOrder: string[];
}
