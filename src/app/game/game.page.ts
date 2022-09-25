import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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

  gameModel$: Observable< Globals.GameModel>;

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
    this.gameModel$ = this.gameService.getCurrentGameObservable()
    .pipe(
      map(game => {
        let retVal; 
        if(game.player1 == this.authService.getUserEmail()){
          retVal = game.player1Board;
        } else {
          retVal = game.player2Board;
        }
        console.log(retVal);
        return retVal;
      })
    )}

    getCornerState(gameModel: Globals.GameModel, h: number, v:number): string {
      try{
        if(gameModel.horizontalEdges[h][v] === Globals.EdgeState.Wall) { 
          return Globals.EdgeState.Border
        } 
      } catch {}
      try{
        if(gameModel.horizontalEdges[h-1][v] === Globals.EdgeState.Wall) { 
          return Globals.EdgeState.Border
        }
      } catch {}
      try{
        if(gameModel.verticalEdges[h][v] === Globals.EdgeState.Wall) { 
          return Globals.EdgeState.Border
        }
      } catch {}
      try{
        if(gameModel.verticalEdges[h][v-1] === Globals.EdgeState.Wall) { 
          return Globals.EdgeState.Border
        }
      } catch {}
      return Globals.EdgeState.Unknown;
    }

    getSquareVisited(gameModel: Globals.GameModel, h: number, v:number): string {
      if (gameModel.squares[h][v] === Globals.SquareState.Visited) {
        return 'squareVisited';
      } else {
        return 'squareUnvisited';
      }
    }

    getTranslatedEdgeState(gameModel: Globals.GameModel, horizontal: boolean, h: number, v: number): string {
      let modelEdgeState: Globals.EdgeState;
      if (horizontal){
        modelEdgeState = gameModel.horizontalEdges[h][v];
      } else {
        modelEdgeState = gameModel.verticalEdges[h][v];
      }
      if(horizontal == false){
        console.log('vertical : ' + modelEdgeState);
        console.log(h + ':' + v);
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
      if (horizontal == false){
        console.log('retval : ' + retval);
      }
      return retval;
    }


  }