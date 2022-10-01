import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Globals from '../../globals';
import { AuthService } from '../services/auth';
import { GameService } from '../services/game';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  private game: Globals.Game;
  public gameModel$: Observable< Globals.GameModel>;
  public opponentGameModel$: Observable< Globals.GameModel>;
  private squareClickedPending = false;

  constructor(private authService: AuthService, private gameService: GameService) {
    this.gameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        this.game = game;
        let retVal; 
        if(game.player1 == this.authService.getUserEmail()){
          retVal = game.player1Board;
        } else {
          retVal = game.player2Board;
        }
        return retVal;
      })
    );
    this.opponentGameModel$ = this.gameService.getCurrentGameObservable().pipe(
      map(game => {
        let retVal; 
        if(game.player1 == this.authService.getUserEmail()){
          retVal = game.player2Board;
        } else {
          retVal = game.player1Board;
        }
        return retVal;
      })
    );
  
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
      if(this.squareClickedPending){return}
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
        } else {
          gameModel.marker.horizontal = h;
          gameModel.marker.vertical = v;
          gameModel.squares[h][v] = Globals.SquareState.Visited;
          gameModel.verticalEdges[h+1][v] = Globals.EdgeState.visitedNoWall;
        }
      } 
      this.gameService.pushGameModelToFirebase(this.game, gameModel)
      .then(() => this.squareClickedPending = false)
      .catch(err => {
        console.log(err);
        this.squareClickedPending = false;
      })
    }

  }