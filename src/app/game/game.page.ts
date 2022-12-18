import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Timestamp } from '@angular/fire/firestore';
import { EMPTY, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as Globals from '../../globals';
import { AuthService } from '../services/auth';
import { GameService } from '../services/game';
import { GameFinishModalComponent } from './modalComponents/gameFinish/gameFinishModal.component';
import { GameStartModalComponent } from './modalComponents/gameStart/gameStartModal.component';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  private alerted = false;
  private game: Globals.Game;
  public gameModel$: Observable< Globals.GameModel>;
  private intervalId: any;
  public opponentGameModel$: Observable< Globals.GameModel>;
  private turnText: Globals.turnText;
  private readonly turnTime = 60;
  private squareClickedPending = false;
  private timeRemaining = this.turnTime;

  constructor(private modalController: ModalController, private authService: AuthService, public gameService: GameService) {
  }

  public getCornerState(gameModel: Globals.GameModel, h: number, v:number): string {
    if(gameModel.horizontalEdges[h][v] === Globals.EdgeState.visitedWall) { 
      return Globals.EdgeState.Border
    } 
    if(gameModel.horizontalEdges[h-1][v] === Globals.EdgeState.visitedWall) { 
      return Globals.EdgeState.Border
    }
    if(gameModel.verticalEdges[h][v] === Globals.EdgeState.visitedWall) { 
      return Globals.EdgeState.Border
    }
    if(gameModel.verticalEdges[h][v-1] === Globals.EdgeState.visitedWall) { 
      return Globals.EdgeState.Border
    }
    return Globals.EdgeState.Unknown;
  }

  public getFormattedTurnText(): string{
    if(this.turnText == Globals.turnText.WAITING){
      return this.turnText + String(this.timeRemaining) + ' seconds';
    } else {
      return this.turnText;
    }
  }

  public getOpponentCornerState(gameModel: Globals.GameModel, h: number, v:number): string {
    if((gameModel.horizontalEdges[h][v] === Globals.EdgeState.visitedWall) || 
                    (gameModel.horizontalEdges[h][v] === Globals.EdgeState.Wall)) { 
      return Globals.EdgeState.Border
    } 
    if((gameModel.horizontalEdges[h-1][v] === Globals.EdgeState.visitedWall) || 
                    (gameModel.horizontalEdges[h-1][v] === Globals.EdgeState.Wall)) { 
      return Globals.EdgeState.Border
    }
    if((gameModel.verticalEdges[h][v] === Globals.EdgeState.visitedWall) ||
                    (gameModel.verticalEdges[h][v] === Globals.EdgeState.Wall)) { 
      return Globals.EdgeState.Border
    }
    if((gameModel.verticalEdges[h][v-1] === Globals.EdgeState.visitedWall) || 
                    (gameModel.verticalEdges[h][v-1] === Globals.EdgeState.visitedWall)) { 
      return Globals.EdgeState.Border
    }
    return Globals.EdgeState.Unknown;
  }

  public getOpponentTranslatedEdgeState(gameModel: Globals.GameModel, horizontal: boolean, h: number, v: number): string {
    let modelEdgeState: Globals.EdgeState;
    if (horizontal){
      modelEdgeState = gameModel.horizontalEdges[h][v];
    } else {
      modelEdgeState = gameModel.verticalEdges[h][v];
    }
    let retval: string;
    switch (modelEdgeState){
      case Globals.EdgeState.visitedWall:
        retval = Globals.EdgeState.visitedWall;
        break;
      case Globals.EdgeState.visitedNoWall:
        retval = Globals.EdgeState.visitedNoWall;
        break;
      case Globals.EdgeState.Wall:
        retval = Globals.EdgeState.Wall;
        break;
    default:
      retval = Globals.EdgeState.Unknown;
      break;
    }
    return retval;
  }
  
  public getSquareVisited(gameModel: Globals.GameModel, h: number, v:number): string {
    if (gameModel.squares[h][v] == Globals.SquareState.Visited) {
      return 'squareVisited';
    } else {
      return 'squareUnvisited';
    }
  }
  
  public getTranslatedEdgeState(gameModel: Globals.GameModel, horizontal: boolean, h: number, v: number): string {
    let modelEdgeState: Globals.EdgeState;
    if (horizontal){
      modelEdgeState = gameModel.horizontalEdges[h][v];
    } else {
      modelEdgeState = gameModel.verticalEdges[h][v];
    }
    let retval: string;
    switch (modelEdgeState){
      case Globals.EdgeState.Opening:
      case Globals.EdgeState.Unknown:
      case Globals.EdgeState.Wall:
        retval = Globals.EdgeState.Unknown;
        break;
    default:
      retval = modelEdgeState; 
      break;
    }
    return retval;
  }

  public ngOnInit(){
    this.gameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        let retVal; 
        if(game){
          this.game = game;
          this.turnText = this.populateTurnText(game);
          if(game.player1 == this.authService.getUserId()){
            retVal = game.player2Board;
          } else {
            retVal = game.player1Board;
          }
        }
      return retVal;
      })
    );
    this.opponentGameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        let retVal; 
        if(game.player1 == this.authService.getUserId()){
          retVal = game.player1Board;
        } else {
          retVal = game.player2Board;
        }
        return retVal;
      })
    );
    this.gameService.getCurrentGameObservable().pipe(
      switchMap(game => {
        const opponentId = (game.player1 == this.authService.getUserId()) ? game.player2 : game.player1;
        return from(this.gameService.getOpponent(opponentId)).pipe(
          switchMap(opponent => {
            if(!this.alerted && game.player1 && game.player2){
              this.alerted = true;
              return this.modalController.create({ 
                component: GameStartModalComponent,
                componentProps: {opponent: opponent}
                }
              )
            } else {
              return EMPTY;
            }
          }))
      }),
      switchMap(a => {
            if(a){return a.present()} else {return EMPTY}
      })
    ).subscribe();
  }

  private populateTurnText(game: Globals.Game): Globals.turnText {
    clearInterval(this.intervalId);
    if(game.gameState == Globals.GameState.FINISHED){
      this.modalController.create({ 
        component: GameFinishModalComponent,
        componentProps: {game}
        }
      ).then(a => a.present());
    }
    if (game.player1 == this.authService.getUserId()){
      if(game.player2Board?.turns > game.player1Board?.turns){
        this.resetTimeRemaining();
        return Globals.turnText.WAITING;
      }
      if(game.player2Board?.turns <= game.player1Board?.turns){
        return Globals.turnText.YOU_CAN_PLAY;
      }
    } else {
      if(game.player1Board?.turns > game.player2Board?.turns){
        this.resetTimeRemaining();
        return Globals.turnText.WAITING;
      }
      if(game.player1Board?.turns <= game.player2Board?.turns){
        return Globals.turnText.YOU_CAN_PLAY;
      }
    }
  }

  private resetTimeRemaining(){
    this.timeRemaining = this.turnTime;
    this.intervalId = setInterval(() => {
      this.timeRemaining = this.timeRemaining - 1;
      if(this.timeRemaining == 0){
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  public squareClick(gm: Globals.GameModel, h: number, v: number): void{
    let finished : boolean;
    let winner: string;
    let loser: string;
    let resultReason: Globals.ResultReason;
    if(this.squareClickedPending){return}
    if(this.game.player1 == this.authService.getUserId()){
      if(this.game.player2Board.turns > this.game.player1Board.turns){return}
    } else {
      if(this.game.player1Board.turns > this.game.player2Board.turns){return}
    }
    const gameModel = this.gameService.cloneGameModel(gm);
    const deltah = h - gameModel.marker.horizontal;
    const deltav = v - gameModel.marker.vertical;
    const absh = Math.abs(deltah);
    const absv = Math.abs(deltav);
    if((absh > 1) || (absv > 1)) { return;}
    if((absh == 0) && (absv == 0)) { return;}
    if (!((absh == 0) || (absv == 0))) { return;}
    this.squareClickedPending = true;
    if (deltav == 1){
      if(gameModel.horizontalEdges[h][v] == Globals.EdgeState.Wall || gameModel.horizontalEdges[h][v] == Globals.EdgeState.visitedWall){
        gameModel.horizontalEdges[h][v] = Globals.EdgeState.visitedWall;
        gameModel.turns = gameModel.turns + 1;
      } else {
        gameModel.marker.horizontal = h;
        gameModel.marker.vertical = v;
        gameModel.squares[h][v] = Globals.SquareState.Visited;
        gameModel.horizontalEdges[h][v] = Globals.EdgeState.visitedNoWall;
      }
    } 
    if (deltav == -1){
      if(gameModel.horizontalEdges[h][v+1] == Globals.EdgeState.Wall || gameModel.horizontalEdges[h][v+1] == Globals.EdgeState.visitedWall){
        gameModel.horizontalEdges[h][v+1] = Globals.EdgeState.visitedWall;
        gameModel.turns = gameModel.turns + 1;
      } else {
        gameModel.marker.horizontal = h;
        gameModel.marker.vertical = v;
        gameModel.squares[h][v] = Globals.SquareState.Visited;
        gameModel.horizontalEdges[h][v+1] = Globals.EdgeState.visitedNoWall;
      }
    } 
    if (deltah == 1){
      if(gameModel.verticalEdges[h][v] == Globals.EdgeState.Wall || gameModel.verticalEdges[h][v] == Globals.EdgeState.visitedWall){
        gameModel.verticalEdges[h][v] = Globals.EdgeState.visitedWall;
        gameModel.turns = gameModel.turns + 1;
      } else {
        gameModel.marker.horizontal = h;
        gameModel.marker.vertical = v;
        gameModel.squares[h][v] = Globals.SquareState.Visited;
        gameModel.verticalEdges[h][v] = Globals.EdgeState.visitedNoWall;
      }
    }
    if (deltah == -1){
      if(gameModel.verticalEdges[h+1][v] == Globals.EdgeState.Wall || gameModel.verticalEdges[h+1][v] == Globals.EdgeState.visitedWall){
        gameModel.verticalEdges[h+1][v] = Globals.EdgeState.visitedWall;
        gameModel.turns = gameModel.turns + 1;
      } else {
        gameModel.marker.horizontal = h;
        gameModel.marker.vertical = v;
        gameModel.squares[h][v] = Globals.SquareState.Visited;
        gameModel.verticalEdges[h+1][v] = Globals.EdgeState.visitedNoWall;
      }
    } 
    if ((gameModel.marker.horizontal == gameModel.target.horizontal) && (gameModel.marker.vertical == gameModel.target.vertical)){
      finished = true;
      resultReason = Globals.ResultReason.TARGETFOUND;
      winner = this.authService.getUserId();
      loser = (this.game.player1 == this.authService.getUserId()) ? this.game.player1 : this.game.player2;
    }
    this.gameService.pushGameModelToFirebase(this.game, gameModel, finished, winner, loser, resultReason)
    .then(() => this.squareClickedPending = false)
    .catch(err => {
      console.log(err);
      this.squareClickedPending = false;
    })
  }
}