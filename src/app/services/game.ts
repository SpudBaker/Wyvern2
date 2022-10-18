import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, collectionData, doc, docSnapshots, DocumentData, DocumentReference, Firestore, getDoc, getDocs, getFirestore, query, runTransaction, where } from '@angular/fire/firestore';
import * as Globals from '../,,/../../globals';
import { AuthService } from '../services/auth';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class GameService{

    public gameInPlay: Globals.Game;

    constructor(private authService: AuthService, private firestore: Firestore, private router: Router){}

    public cloneGameModel(gm: Globals.GameModel): Globals.GameModel {
      const newGM = new Globals.GameModel();
      newGM.horizontalEdges = new Array<Globals.EdgeState[]>();
      gm.horizontalEdges.forEach(item => {
        const newArray = new Array<Globals.EdgeState>();
        item.forEach(item2 => {
          newArray.push(item2);
        });
        newGM.horizontalEdges.push(newArray);
      });
      newGM.marker = {...gm.marker};
      newGM.squares = new Array<Globals.SquareState[]>();
      for (let item of gm.squares){
        const newArray = new Array<Globals.SquareState>();
        for(let item2 of item){
          newArray.push(item2);
        };
        newGM.squares.push(newArray);
      };
      newGM.target = {...gm.target};
      newGM.turns = gm.turns;
      newGM.validRouteExists = gm.validRouteExists;
      newGM.verticalEdges = new Array<Globals.EdgeState[]>();
      gm.verticalEdges.forEach(item => {
        const newArray = new Array<Globals.EdgeState>();
        item.forEach(item2 => {
          newArray.push(item2);
        });
        newGM.verticalEdges.push(newArray);
      });
      return newGM;
    }

    public async continue(gameModel: Globals.GameModel): Promise<void> {
        const gamesCollection = collection(this.firestore, "games");
        let matchedDoc: DocumentReference;
        const q = query(gamesCollection, where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS));
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
          await runTransaction(this.firestore, async transaction => {
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
      const game: Globals.Game = new Globals.Game();
      game.id = doc.id;
      game.gameState = doc.data().gameState;
      game.player1 = doc.data().player1;
      game.player2 = doc.data().player2;
      game.player1Board = doc.data().player1Board ? JSON.parse(doc.data().player1Board) : undefined;
      game.player2Board = doc.data().player2Board ? JSON.parse(doc.data().player2Board) : undefined;
      return game;
    }

    public getCurrentGameObservable(): Observable<Globals.Game>{
      if(!this.gameInPlay){return EMPTY}
      const docRef = doc(this.firestore, "games", this.gameInPlay.id) as DocumentReference;
      return docSnapshots(docRef).pipe(
        map(docRef => this.convertDocTGameObject(docRef))
      );
    }
    
    public async getIncompleteGames(): Promise<Globals.Game[]> {
      let games = new Array<Globals.Game>;
      const qPlayer1 = query(collection(this.firestore, "games"), where("gameState", "in", 
          [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player1", "==", this.authService.getUserEmail()));
      const queryPlayer1Snapshot = await getDocs(qPlayer1);
      queryPlayer1Snapshot.forEach(d =>
        games.push(this.convertDocTGameObject(d))
      );
      const qPlayer2 = query(collection(this.firestore, "games"), where("gameState", "in", 
          [Globals.GameState.WAITING_FOR_PLAYERS, Globals.GameState.IN_PROGRESS]), where("player2", "==", this.authService.getUserEmail()));
      const queryPlayer2Snapshot = await getDocs(qPlayer2);
      queryPlayer2Snapshot.forEach(d => {
        games.push(this.convertDocTGameObject(d));
      })
      return games;
    }

    public async getOpponent(email: string): Promise<any>{
      if(!email){return undefined};
      const colRef = collection(this.firestore, 'users');
      const q = query(colRef, where('email', '==', email));
      const docSnapshots = await getDocs(q);
      if(docSnapshots.size == 1){
        let retVal;
        docSnapshots.forEach(snap => retVal = snap.data());
        return retVal;
      } else {
        throw new Error('wrong number of opponent users');
      }
    }

    public getUsers(): Observable<string[]>{
      const usercol = collection(this.firestore, 'users');
      return collectionData(usercol).pipe(
        map(arr => {
          const retArr = new Array<string>();
          arr.forEach(doc => {retArr.push(doc.email)});
          return retArr;
        })
      )
    }

    public navigateHome(): void {
      this.router.navigate(['home']);
    }

    public async pushGameModelToFirebase(game: Globals.Game, gameModel: Globals.GameModel, finished: boolean): Promise<any> {
      const docRef = doc(this.firestore, "games", game.id) as DocumentReference;
      await runTransaction(this.firestore, async transaction => {
        if((await getDoc(docRef)).data().gameState != Globals.GameState.FINISHED){
          if(this.authService.getUserEmail() == game.player1){
            transaction.update(docRef, { player2Board: JSON.stringify(gameModel)});
          } else {
            transaction.update(docRef, { player1Board: JSON.stringify(gameModel)});
          }
          if (finished) {
            transaction.update(docRef, { gameState: Globals.GameState.FINISHED});
          }
        }
    });
  }
  
}