import { Injectable } from '@angular/core';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, getFirestore, query, runTransaction, where } from '@angular/fire/firestore';
import * as Globals from '../,,/../../globals';
import { AuthService } from '../services/auth';

@Injectable({providedIn: 'root'})

export class GameService{

    constructor(private authService: AuthService){}

    public async hasIncompleteGame(): Promise<DocumentData[]> {
        let games = new Array<DocumentData>;
        const qPlayer1 = query(collection(getFirestore(), "games"), where("gameState", "in", 
            [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player1", "==", this.authService.getUserEmail()));
        const queryPlayer1Snapshot = await getDocs(qPlayer1);
        queryPlayer1Snapshot.forEach(d =>
            games.push(d)
        );
        const qPlayer2 = query(collection(getFirestore(), "games"), where("gameState", "in", 
            [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player2", "==", this.authService.getUserEmail()));
        const queryPlayer2Snapshot = await getDocs(qPlayer2);
        queryPlayer2Snapshot.forEach(d =>
                games.push(d)
        )
        return games;
    }

    public async continue(gameModel: Globals.GameModel): Promise<void> {
        const gamesCollection = collection(getFirestore(), "games");
        let matchedDoc: DocumentReference;
        let matchedUserEmail: string;
        const q = query(collection(getFirestore(), "games"), where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          if (doc.get('player1') != this.authService.getUserEmail()){
            matchedDoc = doc.ref;
            matchedUserEmail = doc.get('player1');
          }
        });
        if (!matchedDoc){
          addDoc( gamesCollection, {
            player1: this.authService.getUserEmail(),
            player1Board: JSON.stringify(gameModel),
            gameState: Globals.GameState.WAITING_FOR_PLAYERS
            }
          );
        } else {
          await runTransaction(getFirestore(), async (transaction) => {
            const sfDoc = await transaction.get(matchedDoc);
            if (sfDoc.get('gameState')===Globals.GameState.WAITING_FOR_PLAYERS) {
                transaction.update(matchedDoc, { player2: this.authService.getUserEmail() });
                transaction.update(matchedDoc, { player2Board: JSON.stringify(gameModel)});
                transaction.update(matchedDoc, { gameState: Globals.GameState.IN_PROGRESS });
            } else {
                addDoc( gamesCollection, {
                    player1: this.authService.getUserEmail(),
                    player1Board: JSON.stringify(gameModel),
                    gameState: Globals.GameState.WAITING_FOR_PLAYERS
                    }
                );
            }
          });
        }
    }
}