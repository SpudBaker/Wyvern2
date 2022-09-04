import { Injectable } from '@angular/core';
import { collection, DocumentReference, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import * as Globals from '../,,/../../globals';
import { AuthService } from '../services/auth';

@Injectable({providedIn: 'root'})

export class GameService{

    constructor(private authService: AuthService){}

    public async hasIncompleteGame(): Promise<DocumentReference[]> {
        let matchedDoc = new Array<DocumentReference>;
        const qPlayer1 = query(collection(getFirestore(), "games"), where("gameState", "in", 
            [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player1", "==", this.authService.getUserEmail()));
        const queryPlayer1Snapshot = await getDocs(qPlayer1);
        queryPlayer1Snapshot.forEach(d =>
            matchedDoc.push(d.ref)
        );
        const qPlayer2 = query(collection(getFirestore(), "games"), where("gameState", "in", 
            [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player2", "==", this.authService.getUserEmail()));
        const queryPlayer2Snapshot = await getDocs(qPlayer2);
        queryPlayer2Snapshot.forEach(d =>
                matchedDoc.push(d.ref)
        )
        return matchedDoc;
    }
}