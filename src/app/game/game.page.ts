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
        console.log('this is the return value');
        console.log(retVal);
        console.log('specifically ...');
        console.log(retVal.verticalEdges)
        return retVal;
      })
    )}
  }