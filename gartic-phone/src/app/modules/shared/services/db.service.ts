import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference,
} from '@angular/fire/firestore';
import { Album, Lobby, Player } from '../types/types';

export const LOBBIES_COLLECTION = 'lobbies';
export const PLAYERS_COLLECTION = 'players';
export const ALBUMS_COLLECTION = 'albums';

@Injectable({
    providedIn: 'root',
})
export class DbService {
    constructor(private afs: AngularFirestore) {}

    getLobbyCollection(): AngularFirestoreCollection<Lobby> {
        return this.afs.collection<Lobby>(LOBBIES_COLLECTION);
    }

    getLobby(lobbyId: string): AngularFirestoreDocument<Lobby> {
        return this.getLobbyCollection().doc<Lobby>(lobbyId);
    }

    getPlayersCollection(lobbyId: string): AngularFirestoreCollection<Player> {
        return this.getLobby(lobbyId).collection(PLAYERS_COLLECTION);
    }

    getPlayer(lobbyId: string, playerId: string): AngularFirestoreDocument<Player> {
        return this.getLobby(lobbyId).collection<Player>(PLAYERS_COLLECTION).doc<Player>(playerId);
    }

    async createLobby(): Promise<DocumentReference<Lobby>> {
        return this.getLobbyCollection().add({
            created: new Date(),
            maxSize: 8,
            isFull: false,
            isActive: false,
            isFinished: false,
            timer: null,
        });
    }

    async updateLobby(lobbyId: string, data: Partial<Lobby>): Promise<void> {
        return this.getLobby(lobbyId).update(data);
    }

    async addPlayer(lobbyId: string, player: Player): Promise<void> {
        return this.getPlayer(lobbyId, player.id).set({
            id: player.id,
            name: player.name,
            avatar: player.avatar,
            isHost: player.isHost,
            album: player.album,
        });
    }

    async addAlbum(lobbyId: string, playerId: string, album: Album): Promise<void> {
        return this.getPlayer(lobbyId, playerId).update({
            album: [album],
        });
    }
}
