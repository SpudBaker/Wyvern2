import { Component } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as Globals from '../../globals';
import { AuthService } from '../services/auth';
import { GameService } from '../services/game';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  private alertSubscription: Subscription;
  private alerted = false;
  private game: Globals.Game;
  public turnText: string = undefined;
  public gameModel$: Observable< Globals.GameModel>;
  public opponentGameModel$: Observable< Globals.GameModel>;
  private squareClickedPending = false;

  constructor(private alertController: AlertController, private authService: AuthService, public gameService: GameService) {
    this.gameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        this.game = game;
        this.turnText = this.populateTurnText(game);
        let retVal; 
        if(game.player1 == this.authService.getUserEmail()){
          retVal = game.player2Board;
        } else {
          retVal = game.player1Board;
        }
        return retVal;
      })
    );
    this.opponentGameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        let retVal; 
        if(game.player1 == this.authService.getUserEmail()){
          retVal = game.player1Board;
        } else {
          retVal = game.player2Board;
        }
        return retVal;
      })
    );
    this.alertSubscription = this.gameService.getCurrentGameObservable().pipe(
      switchMap(game => {
        const a : AlertOptions = {

        };
        if(!this.alerted && game.player1 && game.player2){
          return this.alertController.create(
            { header: 'GAME ON!',
              subHeader: 'Your Opponent is ....',
              message: (game.player1 == this.authService.getUserEmail()) ? game.player2 : game.player1
            }
          )
        } else {
          return EMPTY;
        }
      }),
      switchMap(a => {
        if(a){return a.present()} else {return EMPTY}
      })
    ).subscribe();
  }

  populateTurnText(game: Globals.Game): string {
    if(game.gameState == Globals.GameState.FINISHED){
      const player1Text = (this.authService.getUserEmail() == game?.player1) ? 'you win!' : 'they win!';
      const player2Text = (this.authService.getUserEmail() == game?.player2) ? 'you win!' : 'they win!';
      if((game.player1Board.target.horizontal == game.player1Board.marker.horizontal) &&
          (game.player1Board.target.vertical == game.player1Board.marker.vertical)){
        return player2Text;
      } else {
        return player1Text;
      }
    }
    if (game.player1 == this.authService.getUserEmail()){
      if(game.player2Board?.turns > game.player1Board?.turns){
        return 'Waiting opponent ...';
      }
      if(game.player2Board?.turns <= game.player1Board?.turns){
        return 'You can play';
      }
    } else {
      if(game.player1Board?.turns > game.player2Board?.turns){
        return 'Waiting opponent ...';
      }
      if(game.player1Board?.turns <= game.player2Board?.turns){
        return 'You can play';
      }
    }

  }

    getCornerState(gameModel: Globals.GameModel, h: number, v:number): string {
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

    getOpponentCornerState(gameModel: Globals.GameModel, h: number, v:number): string {
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


    getSquareVisited(gameModel: Globals.GameModel, h: number, v:number): string {
      if (gameModel.squares[h][v] == Globals.SquareState.Visited) {
        return 'squareVisited';
      } else {
        return 'squareUnvisited';
      }
    }

    getOpponentTranslatedEdgeState(gameModel: Globals.GameModel, horizontal: boolean, h: number, v: number): string {
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

    getTranslatedEdgeState(gameModel: Globals.GameModel, horizontal: boolean, h: number, v: number): string {
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

    squareClick(gm: Globals.GameModel, h: number, v: number): void{
      let finished : boolean;
      if(this.squareClickedPending){return}
      if(this.game.player1 == this.authService.getUserEmail()){
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
      }
      this.gameService.pushGameModelToFirebase(this.game, gameModel, finished )
      .then(() => this.squareClickedPending = false)
      .catch(err => {
        console.log(err);
        this.squareClickedPending = false;
      })
    }

  }