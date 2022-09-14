import { Injectable } from '@angular/core';
import { addDoc, collection, doc, docSnapshots, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, getFirestore, query, runTransaction, where } from '@angular/fire/firestore';
import * as Globals from '../,,/../../globals';
import { AuthService } from '../services/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class GameService{

    public gameInPlay: Globals.Game;

    constructor(private authService: AuthService){}

    public async continue(gameModel: Globals.GameModel): Promise<void> {
        const gamesCollection = collection(getFirestore(), "games");
        let matchedDoc: DocumentReference;
        const q = query(collection(getFirestore(), "games"), where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          if (doc.get('player1') != this.authService.getUserEmail()){
            matchedDoc = doc.ref;
          }
        });
        if (!matchedDoc){
          const dref = await addDoc( gamesCollection, {
            player1: this.authService.getUserEmail(),
            player1Board: JSON.stringify(gameModel),
            gameState: Globals.GameState.WAITING_FOR_PLAYERS
            }
          );
          const doc = await getDoc(dref);
          this.gameInPlay = this.convertDocTGameObject(doc);
        } else {
          await runTransaction(getFirestore(), async transaction => {
            const sfDoc = await transaction.get(matchedDoc);
            if (sfDoc.get('gameState')===Globals.GameState.WAITING_FOR_PLAYERS) {
                transaction.update(matchedDoc, { player2: this.authService.getUserEmail() });
                transaction.update(matchedDoc, { player2Board: JSON.stringify(gameModel)});
                transaction.update(matchedDoc, { gameState: Globals.GameState.IN_PROGRESS });
            } else {
                const dref = await addDoc( gamesCollection, {
                    player1: this.authService.getUserEmail(),
                    player1Board: JSON.stringify(gameModel),
                    gameState: Globals.GameState.WAITING_FOR_PLAYERS
                    }
                );
            }
          });
          const doc = await getDoc(matchedDoc);
          this.gameInPlay = this.convertDocTGameObject(doc);
        }
    }

    public convertDocTGameObject(doc: DocumentData): Globals.Game{
      const retval: Globals.Game = doc.data() as Globals.Game;
      retval.id = doc.id;
      return retval;
    }

    public getCurrentGameObservable(): Observable<Globals.Game>{
      const docRef = doc(getFirestore(), "games", this.gameInPlay.id) as DocumentReference;
      return docSnapshots(docRef).pipe(
        map(docRef => this.convertDocTGameObject(docRef))
      );
    }
    
    public async getIncompleteGames(): Promise<Globals.Game[]> {
      let games = new Array<Globals.Game>;
      const qPlayer1 = query(collection(getFirestore(), "games"), where("gameState", "in", 
          [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player1", "==", this.authService.getUserEmail()));
      const queryPlayer1Snapshot = await getDocs(qPlayer1);
      queryPlayer1Snapshot.forEach(d =>
          games.push(this.convertDocTGameObject(d))
      );
      const qPlayer2 = query(collection(getFirestore(), "games"), where("gameState", "in", 
          [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player2", "==", this.authService.getUserEmail()));
      const queryPlayer2Snapshot = await getDocs(qPlayer2);
      queryPlayer2Snapshot.forEach(d => {
              games.push(this.convertDocTGameObject(d));
      }
              
      )
      return games;
  }
}