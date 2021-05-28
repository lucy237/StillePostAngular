import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference,
} from '@angular/fire/firestore';
import { Round, Lobby, Player } from '../types/types';
import { Observable } from 'rxjs';
import firebase from 'firebase';

export const LOBBIES_COLLECTION = 'lobbies';
export const PLAYERS_COLLECTION = 'players';
export const ROUNDS_COLLECTION = 'rounds';

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
            resultCounter: 0,
            roundId: 0,
            timer: null,
            playerOrder: [],
        });
    }

    async updateLobby(lobbyId: string, data: Partial<Lobby>): Promise<void> {
        return this.getLobby(lobbyId).update(data);
    }

    async incrementResultCounter(lobbyId: string): Promise<void> {
        return this.afs
            .collection(LOBBIES_COLLECTION)
            .doc(lobbyId)
            .update({ resultCounter: firebase.firestore.FieldValue.increment(1) });
    }

    async addPlayer(lobbyId: string, player: Player): Promise<void> {
        return this.getPlayer(lobbyId, player.id).set({
            id: player.id,
            name: player.name,
            avatar: player.avatar,
            isHost: player.isHost,
        });
    }
    async updatePlayer(lobbyId: string, playerId: string, data: Partial<Player>): Promise<void> {
        return this.getPlayer(lobbyId, playerId).update(data);
    }

    async setRound(lobbyId: string, playerId: string, round: Round): Promise<DocumentReference<Round>> {
        return this.getPlayer(lobbyId, playerId).collection<Round>(ROUNDS_COLLECTION).add(round);
    }

    getLastRoundFromPlayer(lobbyId: string, playerId: string): Observable<Round[]> {
        return this.getPlayer(lobbyId, playerId)
            .collection<Round>(ROUNDS_COLLECTION, (ref) => {
                return ref.orderBy('roundId', 'asc').limitToLast(1);
            })
            .valueChanges();
    }

    async getAllRoundsFromPlayer(lobbyId: string, playerId: string): Promise<Round[]> {
        const results = await this.getPlayer(lobbyId, playerId)
            .collection<Round>(ROUNDS_COLLECTION, (ref) => ref.orderBy('roundId', 'asc'))
            .get()
            .toPromise();
        return results.docs.map((round) => round.data());
    }
}
