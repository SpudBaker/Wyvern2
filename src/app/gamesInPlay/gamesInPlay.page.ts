import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '../../globals';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-gamesInPlay',
  templateUrl: 'gamesInPlay.page.html',
  styleUrls: ['gamesInPlay.page.scss'],
})
export class GamesInPlayPage {

  public games: Globals.Game[];

  constructor(public authService: AuthService, public gameService: GameService, private router: Router) {
    this.gameService.getIncompleteGames()
    .then(games => {
      this.games = games;
    });
  }

  public getButtonText(game: Globals.Game): string{ 
    let retval: string;
    switch (game.gameState){
      case Globals.GameState.WAITING_FOR_PLAYERS: 
        retval = 'Waiting for opponent';
        break;
      case Globals.GameState.FINISHED:
        retval = 'Finished';
        break;
      case Globals.GameState.IN_PROGRESS:
        retval = 'Game in Progress';
        break;
    }
    return retval;
  }

  public gameButtonPress(game: Globals.Game){
    this.gameService.gameInPlay = game;
    this.router.navigate(['game']);
  } 

}
