export interface Album {
    roundId: number;
    playerId: string;
    description: string | null;
    drawing: string | null;
}

export interface Player {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    album: Album[];
}

export interface Lobby {
    created: Date;
    maxSize: number;
    isFull: boolean;
    isActive: boolean;
    isFinished: boolean;
    timer: null;
}
